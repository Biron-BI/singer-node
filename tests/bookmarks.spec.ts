import {strict as assert} from 'assert'
import {clear_bookmark, get_bookmark, StateProps, write_bookmark} from "bookmarks"
import {Record} from "immutable"

const stream_id_1 = 'customers'
const bookmark_key_1 = 'datetime'
const bookmark_val_1 = 123456789

export const StateFactory = Record<StateProps>({
  bookmarks: {},
})

const filled_state = StateFactory({
  'bookmarks': {
    [stream_id_1]: {
      [bookmark_key_1]: bookmark_val_1,
    },
  },
})

describe("Get Bookmark", () => {
  it("should handle empty state", () => {
    assert.equal(get_bookmark(StateFactory(), "some_stream", "my_key"), undefined)

    assert.equal(get_bookmark(StateFactory(), "some_stream", "my_key", "default_value"), "default_value")
  })

  it("should handle empty bookmark", () => {
    const empty = StateFactory({"bookmarks": {}})
    assert.equal(get_bookmark(empty, "some_stream", "my_key"), undefined)
    assert.equal(get_bookmark(empty, "some_stream", "my_key", "default_value"), "default_value")
  })

  it("should handle filled state", () => {

    assert.equal(get_bookmark(filled_state, "some_stream", "my_key"), undefined)

    assert.equal(get_bookmark(filled_state, stream_id_1, "my_key"), undefined)

    assert.equal(get_bookmark(filled_state, stream_id_1, bookmark_key_1), bookmark_val_1)


    // With default
    assert.equal(get_bookmark(filled_state, "some_stream", "my_key", "default"), "default")

    assert.equal(get_bookmark(filled_state, stream_id_1, "my_key", "default"), "default")

    assert.equal(get_bookmark(filled_state, stream_id_1, bookmark_key_1, "default"), bookmark_val_1)


  })
})

describe("Clear Bookmark", () => {
  it("should do nothing if key doesnt exist", () => {
    assert.deepEqual(clear_bookmark(filled_state, "some_stream", "my_key").toObject(), {
      'bookmarks': {
        [stream_id_1]: {
          [bookmark_key_1]: bookmark_val_1,
        },
      },
    })
  })

  it("should clear bookmark", () => {
    assert.deepEqual(clear_bookmark(filled_state, stream_id_1, bookmark_key_1).toObject(), {
      'bookmarks': {
        [stream_id_1]: {},
      },
    })
  });
})

describe("Write Bookmark", () => {
  it("should write bookmark", () => {
    assert.deepEqual(write_bookmark(filled_state, "some_stream", "my_key", "my_value").toObject(), {
      'bookmarks': {
        [stream_id_1]: {
          [bookmark_key_1]: bookmark_val_1,
        },
        "some_stream": {
          my_key: "my_value"
        }
      },
    })
  })
})
