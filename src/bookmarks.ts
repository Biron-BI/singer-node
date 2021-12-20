import {Record as ImmutableRecord} from "immutable"

/**
 * Utilisation de Record Immutable.
 *
 * Pour: hyper clean à écrire, facile à tester, sécurisant
 *
 * Contre:
 *  perds les types sur les breadcrumbs
 *  force l'utilisation d'immutable.js par quiconque utilise ces méthodes (ou à nous d'accepter du mutable et de fare une surcouche mais alourdirait beaucoup le code --> Le problème du non natif
 *  ajoute des packets 'inutiles' à une librairie
 */

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

export type State = ImmutableRecord<StateProps>

export const write_bookmark = (state: State, tap_stream_id: string, key: string, value: Value): State =>
  state.setIn([bookmarksRootKey, tap_stream_id, key], value)

export const clear_bookmark = (state: State, tap_stream_id: string, key: string): State => state.removeIn([bookmarksRootKey, tap_stream_id, key])

export const reset_stream = (state: State, tap_stream_id: string): State =>
  state.removeIn([bookmarksRootKey, tap_stream_id])

export const get_bookmark = (state: State, tap_stream_id: keyof Bookmark, key: string, default_value?: Value): Value => state.getIn([bookmarksRootKey, tap_stream_id, key]) as Value ?? default_value

export const set_offset = (state: State, tap_stream_id: string, offset_key: string, offset_value: Value): State => state.setIn([bookmarksRootKey, tap_stream_id, offsetRootKey, offset_key], offset_value)

export const clear_offset = (state: State, tap_stream_id: string) => state.removeIn([bookmarksRootKey, tap_stream_id, offsetRootKey])

export const get_offset = (state: State, tap_stream_id: string, default_value?: Value) => state.getIn([bookmarksRootKey, tap_stream_id, offsetRootKey] ?? default_value)

export const get_currently_syncing = (state: State, default_value?: string) => state.get("currently_syncing") ?? default_value

export const set_currently_syncing = (state: State, tap_stream_id: string): State => state.set("currently_syncing", tap_stream_id)
