export class Schema {
  private type?: string
  private items?: unknown
  private properties?: unknown
  private selected?: unknown
  private inclusion?: unknown
  private description?: unknown
  private minimum?: unknown
  private maximum?: unknown
  private exclusiveMinimum?: unknown
  private exclusiveMaximum?: unknown
  private multipleOf?: unknown
  private maxLength?: unknown
  private minLength?: unknown
  private anyOf?: unknown
  private format?: unknown
  private additionalProperties?: unknown
  private patternProperties?: unknown

  constructor(
    type?: string,
    items?: unknown,
    properties?: unknown,
    selected?: unknown,
    inclusion?: unknown,
    description?: unknown,
    minimum?: unknown,
    maximum?: unknown,
    exclusiveMinimum?: unknown,
    exclusiveMaximum?: unknown,
    multipleOf?: unknown,
    maxLength?: unknown,
    minLength?: unknown,
    anyOf?: unknown,
    format?: unknown,
    additionalProperties?: unknown,
    patternProperties?: unknown,
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
