import {NullableObjectKeys} from "./utils"

type Value = string | number | undefined | Record<string, string | number>

interface Bookmark {
  offset?: Record<string, any>

  [k: string]: Value
}

type Bookmarks = Record<string, Bookmark>

export interface State {
  bookmarks?: Bookmarks;
  currently_syncing?: string
}

export const write_bookmark = (state: State, tap_stream_id: string, key: string, value: Value): State => ({
  ...state,
  bookmarks: {
    ...state.bookmarks,
    [tap_stream_id]: {
      ...state.bookmarks?.[tap_stream_id],
      [key]: value,
    },
  },
})

export const clear_bookmark = (state: State, tap_stream_id: string, key: string): State => ({
  ...state,
  bookmarks: {
    ...state.bookmarks,
    [tap_stream_id]: NullableObjectKeys(state.bookmarks?.[tap_stream_id])
      ?.reduce((acc: Record<string, Value>, tap_key) => {
        if (tap_key !== key) {
          acc[tap_key] = state.bookmarks?.[tap_stream_id][tap_key]
        }
        return acc
      }, {}) ?? {},
  },
})

export const reset_stream = (state: State, tap_stream_id: string): State => ({
  ...state,
  bookmarks: {
    ...state.bookmarks,
    [tap_stream_id]: {},
  },
})

export const get_bookmark = (state: State, tap_stream_id: string, key: string, default_value?: Value) => state.bookmarks?.[tap_stream_id]?.[key] ?? default_value

export const set_offset = (state: State, tap_stream_id: string, offset_key: string, offset_value: Value): State => ({
  ...state,
  bookmarks: {
    ...state.bookmarks,
    [tap_stream_id]: {
      ...state.bookmarks?.[tap_stream_id],
      offset: {
        ...state.bookmarks?.[tap_stream_id]?.offset,
        [offset_key]: offset_value,
      },
    },
  },
})

export const clear_offset = (state: State, tap_stream_id: string) => ({
  ...state,
  bookmarks: {
    ...state.bookmarks,
    [tap_stream_id]: {
      ...state.bookmarks?.[tap_stream_id],
      offset: {},
    },
  },
})

export const get_offset = (state: State, tap_stream_id: string, default_value?: Value) => state.bookmarks?.[tap_stream_id]?.offset ?? default_value

export const get_currently_syncing = (state: State, default_value?: string) => state.currently_syncing ?? default_value

export const set_currently_syncing = (state: State, tap_stream_id: string): State => ({
  ...state,
  currently_syncing: tap_stream_id
})
