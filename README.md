# singer-node

Writes the Singer format from Node. 

Provide functions and classes to help write the Singer format from node.

Based on [singer-python](https://github.com/singer-io/singer-python)

## Usage

`npm install singer-node`

```typescript
import {write_schema, write_records, write_state} from "singer-node"

write_schema('my_table',
  {'properties': {'id': {'type': 'string'}}},
  ['id'])
write_records('my_table',
  [{'id': 'b'}, {'id': 'd'}])
write_state({'my_table': 'd'})
``` 

## Contributing

Feel free to open up issues and pull requests, we'll be happy to review them.

### Immutable

This library is built without any mutable data and should remain so. The library [immutable-js](https://immutable-js.com/) is used.

### Tests

Code is fully tested using mocha

Simply run

```sh
yarn test
```

## Sponsorship

Singer-node is written and maintained by **Biron** https://birondata.com/

## Acknowledgements

Special thanks to the people who built

* [singer](https://github.com/singer-io/getting-started)
* [singer-python](https://github.com/singer-io/singer-python)
* [immutable-js](https://immutable-js.com/)

## License

Copyright © 2021 Biron

Distributed under the AGPLv3
