import {log_warning} from "logger"
import {List} from "immutable"
import {CatalogEntry} from "CatalogEntry"

export class Catalog {
  private streams: List<CatalogEntry>
  constructor(streams: CatalogEntry[]) {
    this.streams = List(streams)
  }

  // Would be way cleaner but forces use of immutable js
  // constructor(private streams: List<CatalogEntry>) {}


  dump() {
    if (this.streams.size === 0) {
      log_warning("Catalog being written with no streams.")
    }
    console.log(this.toJSON())
  }

  toJSON() {
    return JSON.stringify({...this}, null, 2)
  }

  get_stream(tap_stream_id: string) {
    return this.streams.find((stream) => stream.tap_stream_id === tap_stream_id)
  }
}
