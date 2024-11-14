import {Schema, SchemaKeyProperties} from "./Schema"
import {StateProps} from "./bookmarks"
import {log_warning} from "./logger"
import {write_line} from "./output"


export interface SchemaMessageContent {
  type: MessageType.schema
  stream: string
  schema: Schema,
  key_properties: string[]
  cleaning_column?: string
  clean_first: boolean
  bookmark_properties?: string[]
  all_key_properties?: SchemaKeyProperties
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

export interface DeletedRecordMessageContent {
  type: MessageType.deletedRecord
  record: Record<string, any>
  stream: string
}

export interface ActiveStreamsMessageContent {
  type: MessageType.activeStreams
  streams: string[]
}

export interface ActivateVersionMessageContent {
  type: MessageType.activateVersion
  stream: string
  version: number
}

export type MessageContent = SchemaMessageContent | StateMessageContent | RecordMessageContent | ActivateVersionMessageContent | ActiveStreamsMessageContent | DeletedRecordMessageContent

export enum MessageType {
  record = 'RECORD',
  deletedRecord = 'DELETED_RECORD',
  schema = 'SCHEMA',
  state = 'STATE',
  activeStreams = 'ACTIVE_STREAMS',
  activateVersion = 'ACTIVATE_VERSION',
}

// Not timezone aware, could be improved
type TimeExtracted = number

export abstract class Message {
  public abstract type:MessageType
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

export class DeletedRecordMessage extends Message {
  readonly type = MessageType.deletedRecord

  constructor(
    public readonly stream: string,
    public readonly record: Record<string, any>,
    public readonly version?: string,
    public readonly time_extracted?: TimeExtracted,
  ) {
    super()
  }

  public asObject(): DeletedRecordMessageContent {
    return {
      type: this.type,
      stream: this.stream,
      record: this.record,
    }
  }
}

export class SchemaMessage extends Message {
  readonly type = MessageType.schema

  constructor(
    public readonly stream: string,
    public readonly schema: Schema,
    public readonly keyProperties: string[],
    public readonly bookmarkProperties?: string[],
    public readonly cleaningColumn?: string,
    public readonly cleanFirst = false,
    public readonly allKeyProperties?: SchemaKeyProperties,
  ) {
    super()
  }

  public asObject(): SchemaMessageContent {
    return {
      type: MessageType.schema,
      stream: this.stream,
      schema: this.schema,
      key_properties: this.keyProperties,
      clean_first: this.cleanFirst,
      cleaning_column: this.cleaningColumn,
      all_key_properties: this.allKeyProperties,
      ...(this.bookmarkProperties && {bookmark_properties: this.bookmarkProperties}),
    }
  }
}

export class ActiveStreamsMessage extends Message {
  readonly type = MessageType.activeStreams

  constructor(
    public readonly streams: string[],
  ) {
    super()
  }

  public asObject(): ActiveStreamsMessageContent {
    return {
      type: this.type,
      streams: this.streams
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

export class ActivateVersionMessage extends Message {
  readonly type = MessageType.activateVersion

  constructor(
    public readonly stream: string,
    public readonly version: number,
  ) {
    super()
  }

  public asObject(): ActivateVersionMessageContent {
    return {
      type: MessageType.activateVersion,
      stream: this.stream,
      version: this.version,
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

export function parse_message(msg: string): RecordMessage | StateMessage | SchemaMessage | ActivateVersionMessage | ActiveStreamsMessage | DeletedRecordMessage| undefined {
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
        obj["bookmark_properties"] ?? [],
        obj["cleaning_column"],
        obj["clean_first"],
        obj["all_key_properties"],
      )
    case MessageType.state:
      return new StateMessage(ensure_key_defined(obj, 'value'))
    case MessageType.activeStreams:
      return new ActiveStreamsMessage(ensure_key_defined(obj, "streams"))
    case MessageType.activateVersion:
      return new ActivateVersionMessage(
        ensure_key_defined(obj, "stream"),
        ensure_key_defined(obj, 'version'),
      )
    case MessageType.deletedRecord:
      return new DeletedRecordMessage(
        ensure_key_defined(obj, "stream"),
        ensure_key_defined(obj, "record"),
      )
    default:
      log_warning(`Message type not handled : ${msg_type}`)
      return undefined
  }
}

export const format_message = (message: Message) => JSON.stringify(message.asObject())

export const write_message = (message: Message) => write_line(JSON.stringify(message.asObject()))

export const write_record = (stream: string, record: Record<string, any>, stream_alias?: string, time_extracted?: TimeExtracted) => write_message(new RecordMessage(stream_alias || stream, record, undefined, time_extracted))

export const write_records = (stream: string, records: Record<string, any>[]) => records.forEach((record) => write_record(stream, record))

export const write_schema = (
  stream: string,
  schema: Schema,
  key_properties: string[],
  bookmark_properties?: string[],
  stream_alias?: string,
  cleaningColumn?: string,
  cleanFirst = false,
  allKeyProperties?: SchemaKeyProperties,
) => write_message(new SchemaMessage(stream_alias || stream, schema, key_properties, bookmark_properties, cleaningColumn, cleanFirst, allKeyProperties))

export const write_state = (value: StateProps) => write_message(new StateMessage(value))

export const write_activate_version = (
  stream: string,
  version: number,
) => write_message(new ActivateVersionMessage(stream, version))
