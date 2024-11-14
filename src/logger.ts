import {Writable} from "node:stream"

export enum LogLevel {
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  FATAL
}

let configLevel = LogLevel.TRACE

let prefix = ""

let writeStreams: Record<LogLevel, Writable> = {
  [LogLevel.TRACE]: process.stderr,
  [LogLevel.DEBUG]: process.stderr,
  [LogLevel.INFO]: process.stderr,
  [LogLevel.WARN]: process.stderr,
  [LogLevel.ERROR]: process.stderr,
  [LogLevel.FATAL]: process.stderr,
}

function write(logLevel: LogLevel, msg: string) {
  if (logLevel >= configLevel) {
    writeStreams[logLevel].write(`${prefix && `[${prefix}] `}[${LogLevel[logLevel]}] ${msg}\n`)
  }
}

export const log_debug = (msg: string) => write(LogLevel.DEBUG, msg)

export const log_info = (msg: string) => write(LogLevel.INFO, msg)

export const log_warning = (msg: string) => write(LogLevel.WARN, msg)

export const log_error = (msg: string) => write(LogLevel.ERROR, msg)

export const log_critical = (msg: string) => write(LogLevel.FATAL, msg)

export const log_fatal = (msg: string) => write(LogLevel.FATAL, msg)

export const set_log_level = (newLevel: LogLevel) => configLevel = newLevel

export const set_log_prefix = (newPrefix: string) => prefix = newPrefix

export const set_log_stream = (logLevel: LogLevel, writeStream: Writable) => writeStreams[logLevel] = writeStream

