import log from "loglevel"

export const log_debug = (msg: string) => log.debug(msg)

export const log_info = (msg: string) => log.info(msg)

export const log_warning = (msg: string) => log.warn(msg)

export const log_error = (msg: string) => log.error(msg)

export const log_critical = (msg: string) => log.error(`[CRITICAL] ${msg}`)

export const log_fatal = (msg: string) => log.error(`[FATAL] ${msg}`)
