import {Schema} from "Schema"
import {List} from "immutable"

interface ReplicationMetadata {
  "table-key-properties"?: List<string>;
  "forced-replication-method"?: string;
  "valid-replication-keys"?: List<string>;
  selected?: boolean;
  inclusion?: string;
}

interface CatalogMetadata {
  breadcrumb: List<string>
  metadata: ReplicationMetadata
}

interface ICatalogEntry {
  tap_stream_id?: string
  stream?: string
  schema?: Schema
  metadata?: List<CatalogMetadata>
  key_properties?: List<string>
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
  // Metadata for the stream has en empty breadcrumb
  is_selected() {
    return this.schema?.selected || this.metadata?.find((mdata) => mdata.breadcrumb.isEmpty())?.metadata.selected
  }

  //
  // to_dict() {
  //   return JSON.stringify(this)
  // }
}
