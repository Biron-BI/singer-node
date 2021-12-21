import {JSONSchema7} from "json-schema"

interface ExtendedJSONSchema7 extends JSONSchema7 {
  selected?: boolean,
  inclusion?: unknown
}

// Awaiting merge of this PR for a cleaner declaration
// https://github.com/microsoft/TypeScript/pull/44912
// https://github.com/microsoft/TypeScript/issues/5326
export class Schema implements ExtendedJSONSchema7 {
  type?
  items?
  properties?
  description?
  minimum?
  maximum?
  exclusiveMinimum?
  exclusiveMaximum?
  multipleOf?
  maxLength?
  minLength?
  anyOf?
  format?
  additionalProperties?
  patternProperties?
  selected?
  inclusion?

  constructor({
                type,
                items,
                properties,
                selected,
                inclusion,
                description,
                minimum,
                maximum,
                exclusiveMinimum,
                exclusiveMaximum,
                multipleOf,
                maxLength,
                minLength,
                anyOf,
                format,
                additionalProperties,
                patternProperties,
              }: ExtendedJSONSchema7,
  ) {
    this.type = type
    this.properties = properties
    this.items = items
    this.selected = selected
    this.inclusion = inclusion
    this.description = description
    this.minimum = minimum
    this.maximum = maximum
    this.exclusiveMinimum = exclusiveMinimum
    this.exclusiveMaximum = exclusiveMaximum
    this.multipleOf = multipleOf
    this.maxLength = maxLength
    this.minLength = minLength
    this.anyOf = anyOf
    this.format = format
    this.additionalProperties = additionalProperties
    this.patternProperties = patternProperties
  }
}
