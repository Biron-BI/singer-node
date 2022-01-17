import {List} from "immutable"
import {Command, Option} from "commander"
import * as fs from "fs"

export function load_json(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath).toString())
}

interface CustomOption {
  flags: string
  description: string
}

export function parse_args(required_keys: List<string>, additionalOptions: List<CustomOption> = List()) {
  const program = new Command()

  program
    .requiredOption("-c | --config <file>", "Config file")
    .option("-s | --state <file>", "State file")
    .option("--catalog <file>", "Catalog file")
    .option("-d | --discover", "Do schema discovery")

  additionalOptions.forEach((additionalOption) =>
    program.addOption(new Option(additionalOption.flags, additionalOption.description))
  )

  program.parse(process.argv)

  const opts = program.opts<{
    config: string
    state?: string
    catalog?: string
    discover?: boolean
    [k: string]: string | string[] | boolean | undefined // for additional options
  }>()

  const ret = {
    config_path: opts.config,
    state_path: opts.state,
    catalog_path: opts.catalog,
    config: load_json(opts.config),
    state: opts.state && load_json(opts.state),
    catalog: opts.catalog && load_json(opts.catalog),
    opts
  }

  const missing_keys = required_keys.filter((key) => !Object.keys(ret.config).includes(key));
  if (!missing_keys.isEmpty()) {
    throw new Error(`Config is missing required keys: ${missing_keys}`)
  }

  return ret
}
