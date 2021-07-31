/* eslint-disable max-classes-per-file */

import { Schema }          from './schema.decorator'
import { SCHEMA_METADATA } from './schema.decorator'

describe('typesense', () => {
  describe('decorators', () => {
    describe('schema', () => {
      it('should enhance schema with metadata', () => {
        @Schema()
        class Test {}

        expect(Reflect.getMetadata(SCHEMA_METADATA, Test)).toEqual({ name: 'test' })
      })

      it('should enhance schema with custom name metadata', () => {
        @Schema({ name: 'custom' })
        class Test {}

        expect(Reflect.getMetadata(SCHEMA_METADATA, Test)).toEqual({ name: 'custom' })
      })

      it('should enhance schema with `defaultSortingField` metadata', () => {
        @Schema({ defaultSortingField: 'test' })
        class Test {}

        expect(Reflect.getMetadata(SCHEMA_METADATA, Test)).toEqual({
          defaultSortingField: 'test',
          name: 'test',
        })
      })
    })
  })
})
