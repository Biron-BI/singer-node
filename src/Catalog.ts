import {Schema} from "../src/Schema"

class CatalogEntry {
  tap_stream_id?: number
  stream?: unknown
  key_properties?: string[]
  schema?: Schema
  replication_key?: string
  is_view?: unknown
  database?: unknown
  table?: unknown
  row_count?: unknown
  stream_alias?: unknown
  metadata?: unknown
  replication_method?: unknown

  constructor(
    tap_stream_id?: number,
    stream?: unknown,
    key_properties?: string[],
    schema?: Schema,
    replication_key?: string,
    is_view?: unknown,
    database?: unknown,
    table?: unknown,
    row_count?: unknown,
    stream_alias?: unknown,
    metadata?: unknown,
    replication_method?: unknown,
  ) {
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
  //
  // is_selected() {
  //   return this.schema?.selected || false // todo
  // }
  //
  // to_dict() {
  //   return JSON.stringify(this)
  // }
}

class Catalog {

}
