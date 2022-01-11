# singer-node

Writes the Singer format from Node.

Provide functions and classes to help write the Singer format from node.

Based on [singer-python](https://github.com/singer-io/singer-python)

## Usage

`npm install singer-node`

```typescript
import {write_schema, write_records, write_state} from "singer-node"
import {List} from "immutable"

write_schema('my_table', {
    properties: {
      id: {
        type: 'string'
      }
    }
  },
  List(['id'])
)
write_records('my_table',
  List([{
    id: 'b'
  }, {
    id: 'd'
  }])
)
write_state({
  bookmarks: 
    {my_table: 'd'}
})
```

## Sponsorship

Singer-node is written and maintained by **Biron** https://birondata.com/

## Acknowledgements

Special thanks to the people who built

* [singer](https://github.com/singer-io/getting-started)
* [singer-python](https://github.com/singer-io/singer-python)
* [immutable-js](https://immutable-js.com/)

## License

Copyright © 2022 Biron

Distributed under the AGPLv3
