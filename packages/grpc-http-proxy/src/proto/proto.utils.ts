import { Service }   from 'protobufjs'
import { Namespace } from 'protobufjs'
import { Type }      from 'protobufjs'
import { Enum }      from 'protobufjs'
import { Field }     from 'protobufjs'
import { MapField }  from 'protobufjs'
import { OneOf }     from 'protobufjs'
import { Method }    from 'protobufjs'
import get           from 'lodash.get'

export const isNamespace = (lookupType) => {
  if (
    lookupType instanceof Namespace &&
    !(lookupType instanceof Service) &&
    !(lookupType instanceof Type) &&
    !(lookupType instanceof Enum) &&
    !(lookupType instanceof Field) &&
    !(lookupType instanceof MapField) &&
    !(lookupType instanceof OneOf) &&
    !(lookupType instanceof Method)
  ) {
    return true
  }
  return false
}

export const matchingAncestorNamespaceLookup = (typeName, parentNamespace, namespaceChain) => {
  if (!parentNamespace.parent) {
    const namespaceElements = namespaceChain.split('.')
    const firstOccurrence = namespaceElements.indexOf(typeName)
    const lastOccurrence = namespaceElements.lastIndexOf(typeName)
    return namespaceElements.slice(firstOccurrence, lastOccurrence + 1).join('.')
  }

  // eslint-disable-next-line
  namespaceChain = parentNamespace.name + '.' + namespaceChain

  return matchingAncestorNamespaceLookup(typeName, parentNamespace.parent, namespaceChain)
}

export const walkNamespace = (root, onNamespace, parentNamespace?) => {
  const nestedType = (parentNamespace && parentNamespace.nested) || root.nested

  if (nestedType) {
    Object.keys(nestedType).forEach((typeName) => {
      if (parentNamespace) {
        // eslint-disable-next-line
        typeName = matchingAncestorNamespaceLookup(typeName, parentNamespace, typeName)
      }

      const nestedNamespace = root.lookup(typeName)

      if (nestedNamespace && isNamespace(nestedNamespace)) {
        onNamespace(nestedNamespace)
        walkNamespace(root, onNamespace, nestedNamespace)
      }
    })
  }
}

export const serviceByName = (root, serviceName) => {
  if (!root.nested) {
    throw new Error('Empty PROTO!')
  }

  const serviceLeaf = root.nested[serviceName]

  return root.lookupService(serviceLeaf.fullName)
}

export const walkServices = (proto, onService) => {
  const { ast, root } = proto

  walkNamespace(root, (namespace) => {
    const nestedNamespaceTypes = namespace.nested
    if (nestedNamespaceTypes) {
      Object.keys(nestedNamespaceTypes).forEach((nestedTypeName) => {
        const fullNamespaceName = namespace.fullName.startsWith('.')
          ? namespace.fullName.replace('.', '')
          : namespace.fullName

        const nestedType = root.lookup(`${fullNamespaceName}.${nestedTypeName}`)

        if (nestedType instanceof Service) {
          const serviceName = [...fullNamespaceName.split('.'), nestedType.name]
          const fullyQualifiedServiceName = serviceName.join('.')

          onService(nestedType, get(ast, serviceName), fullyQualifiedServiceName)
        }
      })
    }
  })

  Object.keys(ast).forEach((serviceName) => {
    const lookupType = root.lookup(serviceName)

    if (lookupType instanceof Service) {
      onService(serviceByName(root, serviceName), ast[serviceName], serviceName)
    }
  })
}
