import {log_info, log_warning} from "./logger"
import {List} from "immutable"
import {CatalogEntry} from "./CatalogEntry"
import {State} from "./bookmarks"

export class Catalog {
  constructor(private readonly streams: List<CatalogEntry>) {
  }

  static fromJSON = (c: Record<string, any>) => new Catalog(List(c.streams.map(CatalogEntry.fromJSON)))

  add_stream(stream: CatalogEntry) {
    return new Catalog(this.streams.push(stream))
  }

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

  get_selected_streams(state: State) {
    return this.streams
      .sort((a) => a.tap_stream_id === state.get("currently_syncing") ? 1 : -1) // Currently syncing streams should be returned first
      .filter((stream) => {
        const ret = stream.is_selected()
        if (!ret) {
          log_info(`Skipping stream: ${stream.tap_stream_id}`)
        }
        return ret
      })
  }
}
