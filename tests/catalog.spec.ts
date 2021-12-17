import {strict as assert} from "assert"
import {Catalog} from "Catalog"

describe("Write Catalog", () => {
  it("should correctly write empty catalog", () => {
    assert.deepEqual(new Catalog([]).toJSON(), '{\n  "streams": []\n}')
  })

  // it("should correctly write filled catalog", () => {
  //   assert.deepEqual(new Catalog([new CatalogEntry(
  //     "a",
  //   )]).toJSON(), '{\n  "streams": []\n}')
  // })
})

describe("Get selected streams", () => {
})
