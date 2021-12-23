import {Schema} from "./Schema"
import {List} from "immutable"


export interface SchemaMessageContent {
  type: MessageType.schema
  stream: string
  schema: Schema,
  key_properties: string[]
  bookmark_properties?: string[]
}

export interface StateMessageContent {
  type: MessageType.state
}

export interface RecordMessageContent {
  type: MessageType.state
}

export type MessageContent = SchemaMessageContent | StateMessageContent | RecordMessageContent

export enum MessageType {
  record = 'RECORD',
  schema = 'SCHEMA',
  state = 'STATE',
}

// TODO in singer, this should be a timezone aware datetime
type TimeExtracted = number

abstract class Message {
  public abstract asObject(): Record<string, any>;
}

class RecordMessage extends Message {
  constructor(
    private readonly stream: string,
    private readonly record: Record<string, any>,
    private readonly version?: string,
    private readonly time_extracted?: TimeExtracted,
  ) {
    super()
  }

  public asObject(): Record<string, any> {
    return {
      type: MessageType.record,
      stream: this.stream,
      record: this.record,
      ...(this.version && {version: this.version}),
      ...(this.time_extracted && {time_extracted: this.time_extracted}), // TODO Handle date
    }
  }
}

class SchemaMessage extends Message {
  constructor(
    private readonly stream: string,
    private readonly schema: Schema,
    private readonly key_properties: List<string>,
    private readonly bookmark_properties?: List<string>,
  ) {
    super()
  }

  public asObject(): SchemaMessageContent {
    return {
      type: MessageType.schema,
      stream: this.stream,
      schema: this.schema,
      key_properties: this.key_properties.toArray(),
      ...(this.bookmark_properties && {bookmark_properties: this.bookmark_properties.toArray()}),
    }
  }
}

class StateMessage extends Message {
  constructor(
    private readonly value: string | number,
  ) {
    super()
  }

  public asObject(): Record<string, any> {
    return {
      type: MessageType.state,
      value: this.value,
    }
  }
}

// Throw exceptions if key not in record. Otherwise, return value. Could use JSON Schema validation for more precise validation with less code
function ensure_key_defined(obj: Record<string, any>, key: string) {
  if (!Object.keys(obj).includes(key)) {
    throw new Error(`Message is missing required key : '${key}': ${obj}`)
  }
  return obj[key]
}

export function parse_message(msg: string): Message {
  const obj = JSON.parse(msg)
  const msg_type: MessageType = ensure_key_defined(obj, "type")

  switch (msg_type) {
    case MessageType.record:
      return new RecordMessage(
        ensure_key_defined(obj, "stream"),
        ensure_key_defined(obj, "record"),
        obj["version"],
        obj["time_extracted"],
      )
    case MessageType.schema:
      return new SchemaMessage(
        ensure_key_defined(obj, "stream"),
        ensure_key_defined(obj, "schema"),
        ensure_key_defined(obj, "key_properties"),
        obj["bookmark_properties"],
      )
    case MessageType.state:
      return new StateMessage(ensure_key_defined(obj, 'value'))
    default:
      throw new Error(`Unknown message type '${msg_type}'`)
  }
}

export const format_message = (message: Message) => JSON.stringify(message.asObject())

export const write_message = (message: Message) => console.log(message)

export const write_record = (stream: string, record: Record<string, any>, stream_alias?: string, time_extracted?: TimeExtracted) => write_message(new RecordMessage(stream_alias || stream, record, undefined, time_extracted))

export const write_records = (stream: string, records: List<Record<string, any>>) => records.forEach((record) => write_record(stream, record))

export const write_schema = (stream: string, schema: Schema, key_properties: List<string>, bookmark_properties?: List<string>, stream_alias?: string) => write_message(new SchemaMessage(stream_alias || stream, schema, key_properties, bookmark_properties))

export const write_state = (value: string | number) => write_message(new StateMessage(value))
