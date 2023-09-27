import {log_info, log_warning} from "./logger"
import {CatalogEntry} from "./CatalogEntry"
import {State} from "./bookmarks"

export class Catalog {
  constructor(private readonly streams: CatalogEntry[]) {
  }

  static fromJSON = (c: Record<string, any>) => new Catalog(c.streams.map(CatalogEntry.fromJSON))

  add_stream(stream: CatalogEntry) {
    return new Catalog([...this.streams, stream])
  }

  dump() {
    if (this.streams.length === 0) {
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
      .sort((a) => a.tap_stream_id === state.currently_syncing ? -1 : 1) // Currently syncing streams should be returned first
      .filter((stream) => {
        const ret = stream.is_selected()
        if (!ret) {
          log_info(`Skipping stream: ${stream.tap_stream_id}`)
        }
        return ret
      })
  }
}
