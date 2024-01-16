import {Schema} from "./Schema"

export interface ReplicationMetadata {
  "table-key-properties"?: string[];
  "forced-replication-method"?: string;
  "valid-replication-keys"?: string[];
  selected?: boolean;
  inclusion?: string;
}

export interface CatalogMetadata {
  breadcrumb: string[]
  metadata: ReplicationMetadata
}

export interface ICatalogEntry {
  tap_stream_id?: string
  stream?: string
  schema?: Schema
  metadata?: CatalogMetadata[]
  key_properties?: string[]
  replication_key?: string
  is_view?: boolean
  database?: string
  table?: string
  row_count?: number
  stream_alias?: string
  replication_method?: string
}

// Awaiting merge of this PR for a cleaner declaration
// https://github.com/microsoft/TypeScript/pull/44912
// https://github.com/microsoft/TypeScript/issues/5326
export class CatalogEntry implements ICatalogEntry {
  tap_stream_id
  stream
  schema
  metadata
  replication_key
  is_view
  database
  table
  row_count
  stream_alias
  replication_method
  key_properties

  constructor({
                tap_stream_id,
                stream,
                schema,
                metadata,
                replication_key,
                is_view,
                database,
                table,
                row_count,
                stream_alias,
                replication_method,
                key_properties,
              }: ICatalogEntry) {
    this.tap_stream_id = tap_stream_id
    this.stream = stream
    this.key_properties = key_properties
    this.schema = schema
    this.replication_key = replication_key
    this.is_view = is_view
    this.database = database
    this.table = table
    this.row_count = row_count
    this.stream_alias = stream_alias
    this.metadata = metadata
    this.replication_method = replication_method
  }

  // Entry is selected if said so in the schema or if in metadata.
  static fromJSON = (c: Record<string, any>) => new CatalogEntry({
    ...c,
    schema: Schema.fromJSON(c.schema),
    metadata: c.metadata.map((mdata: any) => ({
      breadcrumb: mdata.breadcrumb,
      metadata: {
        ...mdata.metadata,
        "table-key-properties": mdata.metadata["table-key-properties"],
        "valid-replication-keys": mdata.metadata["valid-replication-keys"],
      }
    }))
  })

  // Metadata for the stream has en empty breadcrumb
  is_selected = () => this.schema?.selected || this.metadata?.find((mdata) => mdata.breadcrumb.length === 0)?.metadata.selected
}
