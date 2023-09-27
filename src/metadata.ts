import {ExtendedJSONSchema7} from "./Schema"

export enum ReplicationMethod {
  INCREMENTAL = "INCREMENTAL",
  FULL_TABLE = "FULL_TABLE",
}

export enum Inclusion {
  automatic = "automatic",
  available = "available"
}

interface ReplicationMetadata {
  "table-key-properties"?: string[];
  "forced-replication-method"?: string;
  "valid-replication-keys"?: string[];
  selected?: boolean;
  inclusion?: Inclusion;
}

interface CatalogMetadata {
  breadcrumb: string[];
  metadata: ReplicationMetadata;
}


export function get_standard_metadata(
  schema?: ExtendedJSONSchema7,
  schemaName?: string,
  key_properties?: string[],
  valid_replication_keys?: string[],
  replication_method?: ReplicationMethod,
): CatalogMetadata[] {

  return ([{
    breadcrumb: [],
    metadata: {
      "table-key-properties": key_properties,
      "forced-replication-method": replication_method,
      "valid-replication-keys": valid_replication_keys,
      selected: false // by default a stream is not selected
    }
  }] as CatalogMetadata[]) // first elem represents Stream metadata
    .concat(Object.keys(schema?.properties ?? {}).map((key) => ({
      metadata: {
        inclusion: key_properties?.includes(key) ? Inclusion.automatic : Inclusion.available
      },
      breadcrumb: (["properties", key])
    })))
}