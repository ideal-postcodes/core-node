<h1 align="center">
  <img src="https://img.ideal-postcodes.co.uk/Ideal%20Postcodes%20Node%20Logo@3x.png" alt="Ideal Postcodes Node.js">
</h1>

> Node.js client for api.ideal-postcodes.co.uk

[![CircleCI](https://circleci.com/gh/ideal-postcodes/core-node/tree/master.svg?style=svg)](https://circleci.com/gh/ideal-postcodes/core-node/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/ideal-postcodes/core-node/badge.svg?branch=master&t=nyUaqN)](https://coveralls.io/github/ideal-postcodes/core-node?branch=master)
![Dependency Status](https://david-dm.org/ideal-postcodes/core-node.svg) 
[![npm version](https://badge.fury.io/js/%40ideal-postcodes%2Fcore-node.svg)](https://badge.fury.io/js/%40ideal-postcodes%2Fcore-node)
[![install size](https://packagephobia.now.sh/badge?p=@ideal-postcodes/core-node)](https://packagephobia.now.sh/result?p=@ideal-postcodes/core-node)

`@ideal-postcodes/core-node` is the node.js client for api.ideal-postcodes.co.uk. All javascript clients implement a shared interface which is defined at [`@ideal-postcodes/core-interface`](https://github.com/ideal-postcodes/core-interface)


## Links

- [Configuration & Usage](#configuration-&-usage)
- [Quickstart](#quickstart)
- [Client Documentation](https://core-interface.ideal-postcodes.dev/#documentation)
- [Core API Documentation](https://core-interface.ideal-postcodes.dev/)
- [Core Node Documentation](https://core-node.ideal-postcodes.dev/)
- [npm Module](https://www.npmjs.com/package/@ideal-postcodes/core-node)
- [Github Repository](https://github.com/ideal-postcodes/core-node)

## Other Javascript Clients

- [Browser Client Repository](https://github.com/ideal-postcodes/core-browser) 
- [Bundled Browser Client Repository](https://github.com/ideal-postcodes/core-browser-bundled)

## Documentation

### Configuration & Usage

**Install**

```bash
npm install @ideal-postcodes/core-node
```

**Instantiate**

```javascript
import { Client } from "@ideal-postcodes/core-node"

const client = new Client({ api_key: "iddqd" });
```

[Configuration options](https://core-interface.ideal-postcodes.dev/interfaces/config.html)

**Use**

```javascript
const addresses = await client.lookupPostcode({ postcode: "SW1A2AA" });
```

**Catch Errors**

```javascript
const { IdpcRequestFailedError } = Client.errors;

try {
  await client.lookupAddress({ query: "10 downing street" });
} catch (error) {
  if (error instanceof IdpcRequestFailedError) {
    // IdpcRequestFailedError indicates a 402 response code 
    // Possibly the key balance has been depleted
  }
}
```

---

### Quickstart

The client exposes a number of simple methods to get at the most common tasks when interacting with the API. Below is a (incomplete) list of commonly used methods.

- [Lookup a Postcode](#lookup-a-postcode)
- [Search for an Address](#search-for-an-address)
- [Search for an Address by UDPRN](#search-for-an-address-by-udprn)

For a complete list of client methods, including low level resource methods, please see the [core-interface documentation](https://core-interface.ideal-postcodes.dev/#documentation)

#### Lookup a Postcode

Return addresses associated with a given `postcode`

```javascript
const postcode = "id11qd";

const addresses = await client.lookupPostcode({ postcode });
```

[Method options](https://core-interface.ideal-postcodes.dev/interfaces/lookuppostcodeoptions.html)

#### Search for an Address

Return addresses associated with a given `query`

```javascript
const query = "10 downing street sw1a";

const addresses = await client.lookupAddress({ query });
```

[Method options](https://core-interface.ideal-postcodes.dev/interfaces/lookupaddressoptions.html)

#### Search for an Address by UDPRN

Return address for a given `udprn`

Invalid UDPRN will return `null`

```javascript
const udprn = 23747771;

const address = await client.lookupUdprn({ udprn });
```

[Method options](https://core-interface.ideal-postcodes.dev/interfaces/lookupumprnoptions.html)

## Test

`@ideal-postcodes/core-node` is tested on:

- Node 8
- Node 10
- Node 12

```bash
npm test
```

## License

MIT
