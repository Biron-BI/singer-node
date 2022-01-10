import {
  MutableSchemaKeyProperties,
  Schema,
  SchemaKeyProperties,
  schemaKeyPropertiesToImmutable,
  schemaKeyPropertiesToMutable,
} from "./Schema"
import {List} from "immutable"
import {StateProps} from "./bookmarks"


export interface SchemaMessageContent {
  type: MessageType.schema
  stream: string
  schema: Schema,
  key_properties: string[]
  cleaningColumn?: string
  cleanFirst: boolean
  bookmark_properties?: string[]
  all_key_properties?: MutableSchemaKeyProperties
}

export interface StateMessageContent {
  type: MessageType.state
  value: StateProps
}

export interface RecordMessageContent {
  type: MessageType.record
  record: Record<string, any>
  stream: string
}

export type MessageContent = SchemaMessageContent | StateMessageContent | RecordMessageContent

export enum MessageType {
  record = 'RECORD',
  schema = 'SCHEMA',
  state = 'STATE',
}

// Not timezone aware, could be improved
type TimeExtracted = number

export abstract class Message {
  public abstract asObject(): MessageContent;
}

export class RecordMessage extends Message {
  readonly type = MessageType.record

  constructor(
    public readonly stream: string,
    public readonly record: Record<string, any>,
    public readonly version?: string,
    public readonly time_extracted?: TimeExtracted,
  ) {
    super()
  }

  public asObject(): RecordMessageContent {
    return {
      type: MessageType.record,
      stream: this.stream,
      record: this.record,
      ...(this.version && {version: this.version}),
      ...(this.time_extracted && {time_extracted: this.time_extracted}),
    }
  }
}

export class SchemaMessage extends Message {
  readonly type = MessageType.schema

  constructor(
    public readonly stream: string,
    public readonly schema: Schema,
    public readonly key_properties: List<string>,
    public readonly bookmark_properties?: List<string>,
    public readonly cleaningColumn?: string,
    public readonly cleanFirst = false,
    public readonly all_key_properties?: SchemaKeyProperties

  ) {
    super()
  }

  public asObject(): SchemaMessageContent {
    return {
      type: MessageType.schema,
      stream: this.stream,
      schema: this.schema,
      key_properties: this.key_properties.toArray(),
      cleanFirst: this.cleanFirst,
      cleaningColumn: this.cleaningColumn,
      all_key_properties: schemaKeyPropertiesToMutable(this.all_key_properties),
      ...(this.bookmark_properties && {bookmark_properties: this.bookmark_properties.toArray()}),
    }
  }
}

export class StateMessage extends Message {
  readonly type = MessageType.state

  constructor(
    public readonly value: StateProps,
  ) {
    super()
  }

  public asObject(): StateMessageContent {
    return {
      type: MessageType.state,
      value: this.value,
    }
  }
}

// Throw exceptions if key not in record. Otherwise, return value.
function ensure_key_defined(obj: Record<string, any>, key: string) {
  if (!Object.keys(obj).includes(key)) {
    throw new Error(`Message is missing required key : '${key}': ${obj}`)
  }
  return obj[key]
}

export function parse_message(msg: string): RecordMessage | StateMessage | SchemaMessage {
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
        List(ensure_key_defined(obj, "key_properties")),
        List(obj["bookmark_properties"] ?? []),
        obj["cleaningColumn"],
        obj["cleanFirst"],
        schemaKeyPropertiesToImmutable(obj["all_key_properties"]),
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

export const write_state = (value: StateProps) => write_message(new StateMessage(value))
