import {log_info} from "logger"

const DEFAULT_LOG_INTERVAL = 60 * 1000

class Point {
  constructor(public type: "counter" | "point", public metric: string, public value: number, public tags: any) {}

  log() {
    log_info(`METRIC ${JSON.stringify({...this}, null, 2)}`)
  }
}

/**
 * Version immutable qui retourne des copies à chaque fois ?
 */
export class Counter {
  private readonly last_log_time: number

  constructor(
    private readonly metric: string,
    private readonly value: number = 0,
    private readonly tags: any = {},
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
