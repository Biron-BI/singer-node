import update = require("lodash.update")
import unset = require("lodash.unset")
import get = require("lodash.get")

type Value = string | number | undefined | Record<string, any>

interface Bookmark {
  offset?: Record<string, any>
  [k: string]: Value
}

type Bookmarks = Record<string, Bookmark>

export interface StateProps {
  bookmarks?: Bookmarks;
  currently_syncing?: string
}

const bookmarksRootKey = "bookmarks"
const offsetRootKey = "offset"

export type State = StateProps

export const write_bookmark = (state: State, tap_stream_id: string, key: string, value: Value): State =>
  update(state, `${bookmarksRootKey}.${tap_stream_id}.${key}`, () => value)

export const clear_bookmark = (state: State, tap_stream_id: string, key: string): State => {
  unset(state, `${bookmarksRootKey}.${tap_stream_id}.${key}`)
  return state
}
export const reset_stream = (state: State, tap_stream_id: string): State => {
  unset(state, `${bookmarksRootKey}.${tap_stream_id}`)
  return state
}

export const get_bookmark = (state: State, tap_stream_id: keyof Bookmark, key: string, default_value?: Value): Value => get(state, `${bookmarksRootKey}.${tap_stream_id}.${key}`, default_value)
export const set_offset = (state: State, tap_stream_id: string, offset_key: string, offset_value: Value): State => update(state, `${bookmarksRootKey}.${tap_stream_id}.${offsetRootKey}.${offset_key}`, () => offset_value)
export const clear_offset = (state: State, tap_stream_id: string) => {
  unset(state, `${bookmarksRootKey}.${tap_stream_id}.${offsetRootKey}`)
  return state
}

export const get_offset = (state: State, tap_stream_id: string, default_value?: Value) =>   get(state, `${bookmarksRootKey}.${tap_stream_id}.${offsetRootKey}`, default_value)

export const get_currently_syncing = (state: State, default_value?: string) => get(state, "currently_syncing", default_value)

export const set_currently_syncing = (state: State, tap_stream_id: string): State => update(state, `currently_syncing`, () => tap_stream_id)
