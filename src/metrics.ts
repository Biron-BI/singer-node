import {log_info} from "./logger"

const DEFAULT_LOG_INTERVAL = 60 * 1000

type Tags = Record<string, string>

class Point {
  constructor(public type: "counter" | "timer", public metric: string, public value: number, public tags: Tags) {
  }

  log() {
    log_info(`METRIC ${JSON.stringify({...this}, null, 2)}`)
  }
}

// Constants for metric names
enum Metric {
  record_count = 'record_count',
  job_duration = 'job_duration',
  http_request_duration = 'http_request_duration'
}

// Constants for commonly used tags
enum Tag {
  endpoint = "endpoint",
  job_type = "job_type",
  http_status_code = "http_status_code",
  status = "status"
}

/**
 * Version immutable qui retourne des copies à chaque fois ?
 */
export class Counter {
  private readonly last_log_time: number

  constructor(
    private readonly metric: string,
    private readonly value: number = 0,
    private readonly tags: Tags = {},
    private readonly log_interval = DEFAULT_LOG_INTERVAL,
  ) {
    this.last_log_time = Date.now()
  }

  increment(amount = 1): Counter {
    if (this.ready_to_log()) {
      return new Counter(
        this.metric,
        this.value + 1,
        this.tags,
        this.log_interval,
      ).pop()
    }
    return new Counter(this.metric, this.value + amount, this.tags, this.log_interval)
  }

  // Must be called at the end of processing
  end() {
    return this.pop()
  }

  private ready_to_log(): boolean {
    return Date.now() - this.last_log_time > this.log_interval
  }

  private pop(): Counter {
    new Point("counter", this.metric, this.value, this.tags).log()
    return new Counter(
      this.metric,
      0,
      this.tags,
      this.log_interval,
    )
  }
}

export class Timer {
  private readonly start_time: number

  constructor(
    private readonly metric: string,
    private readonly tags: Tags = {},
  ) {
    this.start_time = Date.now()
  }

  reset() {
    return new Timer(this.metric, this.tags)
  }

  elapsed() {
    return Date.now() - this.start_time
  }

  // Must be called at the end of processing
  end() {
    new Point("timer", this.metric, this.elapsed(), this.tags).log()
    return this
  }
}

export function record_counter(endpoint?: string, log_interval = DEFAULT_LOG_INTERVAL) {
  return new Counter(Metric.record_count, 0, {
    ...(endpoint && {[Tag.endpoint]: endpoint}),
  }, log_interval)
}

export function http_request_timer(endpoint?: string) {
  return new Timer(Metric.http_request_duration, {
    ...(endpoint && {[Tag.endpoint]: endpoint}),
  })
}

export function job_timer(job_type?: string) {
  return new Timer(Metric.job_duration, {
    ...(job_type && {[Tag.job_type]: job_type}),
  })
}
