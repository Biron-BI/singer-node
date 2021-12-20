import {List} from "immutable"
import {Command} from "commander"
import * as fs from "fs"


export function load_json(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath).toString())
}

export function parse_args(required_keys: List<string>) {
  const program = new Command()

  program
    .requiredOption("-c | --config <file>", "Config file")
    .option("-s | --state <file>", "State file")
    .option("--catalog <file>", "Catalog file")
    .option("-d | --discover", "Do schema discovery")

  program.parse(process.argv)

  const opts = program.opts<{
    config: string
    state?: string
    catalog?: string
    discover?: boolean
  }>()

  const ret = {
    config_path: opts.config,
    state_path: opts.state,
    catalog_path: opts.catalog,
    config: load_json(opts.config),
    state: opts.state && load_json(opts.state),
    catalog: opts.catalog && load_json(opts.catalog)
  }

  const missing_keys = required_keys.filter((key) => !Object.keys(ret.config).includes(key));
  if (!missing_keys.isEmpty()) {
    throw new Error(`Config is missing required keys: ${missing_keys}`)
  }

  return {}
}
