import { RequestHandler }                       from 'express'
import { GraphQLSchema }                        from 'graphql'
import { getGraphQLParameters, processRequest } from 'graphql-helix'

export const graphqlExpressHandler = (
  schema: GraphQLSchema,
  contextBuilder: (initialContextValue?: any) => Promise<Record<string, any>>
): RequestHandler => async (req, res) => {
  const request = {
    body: req.body,
    headers: req.headers,
    method: req.method,
    query: req.query,
  }

  const { operationName, query, variables } = getGraphQLParameters(request)

  const result = await processRequest({
    operationName,
    query,
    variables,
    request,
    schema,
    contextFactory: () => contextBuilder(req),
  })

  if (result.type === 'RESPONSE') {
    result.headers.forEach(({ name, value }) => res.setHeader(name, value))

    res.status(result.status)

    if (result.payload.errors?.length) {
      result.payload.errors = result.payload.errors.map((error) => ({
        ...error,
        extensions: error.extensions,
        locations: error.locations,
        message: error.message,
        name: error.name,
        nodes: error.nodes,
        originalError: {
          ...error?.originalError,
          name: error?.originalError?.name,
          message: error?.originalError?.message,
          stack: error?.originalError?.stack?.split('\n'),
        },
        path: error.path,
        positions: error.positions,
        source: {
          body: error.source?.body?.split('\n'),
          name: error.source?.name,
          locationOffset: {
            line: error.source?.locationOffset?.line,
            column: error.source?.locationOffset?.column,
          },
        },
        stack: error.stack?.split('\n'),
      })) as any
    }
    res.json(result.payload)
  } else if (result.type === 'MULTIPART_RESPONSE') {
    res.writeHead(200, {
      Connection: 'keep-alive',
      'Content-Type': 'multipart/mixed; boundary="-"',
      'Transfer-Encoding': 'chunked',
    })

    req.on('close', () => {
      result.unsubscribe()
    })

    res.write('---')

    // eslint-disable-next-line no-shadow
    await result.subscribe((result) => {
      const chunk = Buffer.from(JSON.stringify(result), 'utf8')
      const data = [
        '',
        'Content-Type: application/json; charset=utf-8',
        `Content-Length: ${String(chunk.length)}`,
        '',
        chunk,
      ]

      if (result.hasNext) {
        data.push('---')
      }

      res.write(data.join('\r\n'))
    })

    res.write('\r\n-----\r\n')
    res.end()
  } else {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
    })

    req.on('close', () => {
      result.unsubscribe()
    })

    // eslint-disable-next-line no-shadow
    await result.subscribe((result) => {
      res.write(`data: ${JSON.stringify(result)}\n\n`)
    })
  }
}
