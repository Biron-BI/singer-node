import {strict as assert} from 'assert'
import {ActiveStreamsMessage, MessageType, parse_message} from "../src/Message"

describe("parse_message", () => {
  it('should resolve internal ref', async function () {
    const input = JSON.stringify({"type": "ACTIVE_STREAMS", "streams": ["users", "tickets"]})
    const output = parse_message(input)
    assert.equal(output?.type, MessageType.activeStreams)
    assert.deepEqual((output as ActiveStreamsMessage).streams, ["users", "tickets"])
  })
})
