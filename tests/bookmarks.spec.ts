import {strict as assert} from 'assert'
import {clear_bookmark, get_bookmark, write_bookmark} from "../src/bookmarks"

const stream_id_1 = 'customers'
const bookmark_key_1 = 'datetime'
const bookmark_val_1 = 123456789

export function StateFactory() {
  return {
    bookmarks: {},
  }
}

const filledStateFactory = () => ({
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
    const empty = StateFactory()
    assert.equal(get_bookmark(empty, "some_stream", "my_key"), undefined)
    assert.equal(get_bookmark(empty, "some_stream", "my_key", "default_value"), "default_value")
  })

  it("should handle filled state", () => {

    assert.equal(get_bookmark(filledStateFactory(), "some_stream", "my_key"), undefined)

    assert.equal(get_bookmark(filledStateFactory(), stream_id_1, "my_key"), undefined)

    assert.equal(get_bookmark(filledStateFactory(), stream_id_1, bookmark_key_1), bookmark_val_1)


    // With default
    assert.equal(get_bookmark(filledStateFactory(), "some_stream", "my_key", "default"), "default")

    assert.equal(get_bookmark(filledStateFactory(), stream_id_1, "my_key", "default"), "default")

    assert.equal(get_bookmark(filledStateFactory(), stream_id_1, bookmark_key_1, "default"), bookmark_val_1)


  })
})

describe("Clear Bookmark", () => {
  it("should do nothing if key doesnt exist", () => {
    assert.deepEqual(clear_bookmark(filledStateFactory(), "some_stream", "my_key"), {
      'bookmarks': {
        [stream_id_1]: {
          [bookmark_key_1]: bookmark_val_1,
        },
      },
    })
  })

  it("should clear bookmark", () => {
    assert.deepEqual(clear_bookmark(filledStateFactory(), stream_id_1, bookmark_key_1), {
      'bookmarks': {
        [stream_id_1]: {},
      },
    })
  });
})

describe("Write Bookmark", () => {
  it("should write bookmark", () => {
    assert.deepEqual(write_bookmark(filledStateFactory(), "some_stream", "my_key", "my_value"), {
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
