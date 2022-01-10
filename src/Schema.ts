import {JSONSchema7} from "json-schema"
import {List, Map} from "immutable"

export interface SchemaKeyProperties {
  props: List<string>
  children: Map<string, SchemaKeyProperties>
}

export interface MutableSchemaKeyProperties {
  props: string[]
  children: Record<string, MutableSchemaKeyProperties>
}

export const schemaKeyPropertiesToImmutable = (skp?: MutableSchemaKeyProperties): SchemaKeyProperties | undefined => {
  if (!skp)
    return undefined
  return ({
    props: List(skp.props),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    children: Map(Object.entries(skp.children).map(([key, value]) => [key, schemaKeyPropertiesToImmutable(value)!])),
  })
}

export const schemaKeyPropertiesToMutable = (skp?: SchemaKeyProperties): MutableSchemaKeyProperties | undefined => {
  if (!skp)
    return undefined
  return ({
    props: skp.props.toJSON(),
    children: skp.children.reduce((acc: Record<string, MutableSchemaKeyProperties>, child, key) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      acc[key] = schemaKeyPropertiesToMutable(child)!
      return acc
    }, {})
  })
}

export interface ExtendedJSONSchema7 extends JSONSchema7 {
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
