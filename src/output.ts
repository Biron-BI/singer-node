import {Writable} from "node:stream"
import {LogLevel, set_log_stream} from "./logger"

let outputWriteStream: Writable = process.stdout

export const set_output_stream = (writeStream: Writable, autoAdaptLogStreams: boolean = true) => {
  outputWriteStream = writeStream
  if (autoAdaptLogStreams && writeStream !== process.stdout)
    [LogLevel.TRACE, LogLevel.DEBUG, LogLevel.INFO].forEach((logLevel) => set_log_stream(logLevel, process.stdout))
}

export const write_line = (s: String) => {
  outputWriteStream.write(s)
  outputWriteStream.write("\n")
}
