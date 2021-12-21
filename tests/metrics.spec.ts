import {strict as assert} from 'assert'
import {Counter} from "metrics"

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/*
  Immutability is a pain for Counter ?
  How to test ? Catch console outputs ?
  In python, singer does set internal method to "lambda" so it returns instantly. We can't do this here
 */
// describe("Record Counter", () => {
//   it("should display increment", async () => {
//     const counter = new Counter("users", 0, {}, 500)
//     const updated = counter.increment(32).increment(123).increment(1)
//     await sleep(1000)
//     updated.increment(32).end()
//   })
// })
