import {strict as assert} from 'assert'
import {resolve_schema_references} from "../src/transform"
import {JSONSchema7} from "json-schema"

describe("Resolve schemas", () => {
  it('should resolve internal ref', async function () {
    const schema: JSONSchema7 = {
      "type": "object",
      "definitions": {
        "string_type": {
          "type": "string",
        },
      },
      "properties": {
        "name": {
          "$ref": "#/definitions/string_type",
        },
      },
    }
    const resolved = await resolve_schema_references(schema, "")

    // @ts-ignore ts is drunk
    assert.equal(resolved?.["properties"]?.["name"]?.["type"], "string")
  })

  it('should resolve external ref', async function () {
    const schema: JSONSchema7 = {
      "type": "object",
      "properties": {
        "name": {
          "$ref": "definitions.json#/definitions/string_type",
        },
      },
    }
    const resolved = await resolve_schema_references(schema, "tests/schemas")

    // @ts-ignore ts is drunk
    assert.equal(resolved?.["properties"]?.["name"]?.["type"], "string")
  })
})
