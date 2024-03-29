import {strict as assert} from "assert"
import {Catalog} from "../src/Catalog"
import {CatalogEntry} from "../src/CatalogEntry"
import {Schema} from "../src/Schema"
import {StateFactory} from "./bookmarks.spec"

const selected_catalog_entry = new CatalogEntry({
  tap_stream_id: "a",
  schema: new Schema({}),
  metadata: [{
    metadata: {
      selected: true,
    },
    breadcrumb: [],
  }],
})

const unselected_catalog_entry = new CatalogEntry({
  tap_stream_id: "b",
  schema: new Schema({}),
  metadata: [],
})

const empty_catalog = new Catalog([])
const filled_catalog = new Catalog([selected_catalog_entry, unselected_catalog_entry])

describe("Write Catalog", () => {
  it("should correctly write empty catalog", () => {
    assert.deepEqual(empty_catalog.toJSON(), '{\n  "streams": []\n}')
  })

  it("should correctly write filled catalog", () => {
    assert.deepEqual(filled_catalog.toJSON(), "{\n" +
      "  \"streams\": [\n" +
      "    {\n" +
      "      \"tap_stream_id\": \"a\",\n" +
      "      \"schema\": {},\n" +
      "      \"metadata\": [\n" +
      "        {\n" +
      "          \"metadata\": {\n" +
      "            \"selected\": true\n" +
      "          },\n" +
      "          \"breadcrumb\": []\n" +
      "        }\n" +
      "      ]\n" +
      "    },\n" +
      "    {\n" +
      "      \"tap_stream_id\": \"b\",\n" +
      "      \"schema\": {},\n" +
      "      \"metadata\": []\n" +
      "    }\n" +
      "  ]\n" +
      "}")
  })
})

describe("Get selected streams", () => {
  it("should retrieve the selected entry", () => {
    const selected_streams = filled_catalog.get_selected_streams(StateFactory())
    assert.deepEqual(selected_streams, [selected_catalog_entry])
  })

  it("should resume currently syncing streams", () => {
    const syncing_entry = new CatalogEntry({
      tap_stream_id: 'c',
      schema: new Schema({}),
      metadata: [{metadata: {selected: true}, breadcrumb: []}],
    })
    const catalog = filled_catalog.add_stream(syncing_entry)

    const selected_streams = catalog.get_selected_streams({bookmarks: {}, currently_syncing: "c"})
    assert.deepEqual(selected_streams[0], syncing_entry)
  })
})
