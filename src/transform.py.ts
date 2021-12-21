import {Schema} from "Schema"
import * as $RefParser from "@apidevtools/json-schema-ref-parser"
import * as path from "path"
import {promises as fs} from "fs"

export function resolve_schema_references(schema: Schema, schemas_directory?: string) {
  return $RefParser.dereference(schema, {
    resolve: {
      external: true,
      file: {
        async read(file) {
          if (!schemas_directory) {
            throw new Error("Attempting to resolve external ref without providing schema directory")
          }
          const relativePath = path.relative(process.cwd(), path.resolve(file.url))
          const fixedPath = path.join(schemas_directory, relativePath)
          const fileContent = await fs.readFile(fixedPath)
          return JSON.parse(fileContent.toString())
        },
      },
    },
  })
}
