# [4.0.0-beta.1](https://github.com/ideal-postcodes/core-node/compare/3.0.1...4.0.0-beta.1) (2022-02-03)


### Features

* **Core-Interface:** Update to 3.0 ([de5867a](https://github.com/ideal-postcodes/core-node/commit/de5867a))


### BREAKING CHANGES

* **Core-Interface:** Updates Core-Interface to 3.0.0

## [3.0.1](https://github.com/ideal-postcodes/core-node/compare/3.0.0...3.0.1) (2021-07-19)


### Bug Fixes

* **Deps:** Bump core-interface ([a50c405](https://github.com/ideal-postcodes/core-node/commit/a50c405))

# [3.0.0](https://github.com/ideal-postcodes/core-node/compare/2.1.0...3.0.0) (2021-06-08)


### Features

* **Core Interface:** Update to Version 2 ([9258ecf](https://github.com/ideal-postcodes/core-node/commit/9258ecf))


### BREAKING CHANGES

* **Core Interface:** - Package now exports a `defaults` object
- Client.defaults has been removed
- All client config is now stored in `client.config`
- All resources have been removed from the client. Instead retrieve
these from the library and inject the client. E.g.
`client.postcodes.retrieve` becomes `postcodes.retrieve(client, ...)`
- Helper methods (like lookupPostcode, ping) have been removed from the client.
Instead retrieve these from teh library and inject the client. E.g.
`client.lookupPostcode` becomes `lookupPostcode(client, ...)`

# [3.0.0](https://github.com/ideal-postcodes/core-node/compare/2.1.0...3.0.0) (2021-06-08)


### Features

* **Core Interface:** Update to Version 2 ([9258ecf](https://github.com/ideal-postcodes/core-node/commit/9258ecf))


### BREAKING CHANGES

* **Core Interface:** - Package now exports a `defaults` object
- Client.defaults has been removed
- All client config is now stored in `client.config`
- All resources have been removed from the client. Instead retrieve
these from the library and inject the client. E.g.
`client.postcodes.retrieve` becomes `postcodes.retrieve(client, ...)`
- Helper methods (like lookupPostcode, ping) have been removed from the client.
Instead retrieve these from teh library and inject the client. E.g.
`client.lookupPostcode` becomes `lookupPostcode(client, ...)`

# [2.1.0](https://github.com/ideal-postcodes/core-node/compare/2.0.0...2.1.0) (2020-08-07)


### Features

* **Core Interface:** Bump to 1.6.0 ([8a723e6](https://github.com/ideal-postcodes/core-node/commit/8a723e6))

# [2.0.0](https://github.com/ideal-postcodes/core-node/compare/1.3.0...2.0.0) (2020-07-07)


### chore

* **Node:** Drop support for node 8, Add node 14 ([001e2c4](https://github.com/ideal-postcodes/core-node/commit/001e2c4))


### Features

* **HTTP Client:** Upgrade Got to 11.X ([5beef3e](https://github.com/ideal-postcodes/core-node/commit/5beef3e))


### BREAKING CHANGES

* **Node:** Node 8 no longer supported
* **HTTP Client:** Underlying Got HTTP agent upgraded to 11.X

# [1.3.0](https://github.com/ideal-postcodes/core-node/compare/1.2.0...1.3.0) (2020-02-07)


### Features

* **core-interface:** Upgrade to 1.5.0 ([ecb3ef3](https://github.com/ideal-postcodes/core-node/commit/ecb3ef3))

# [1.2.0](https://github.com/ideal-postcodes/core-node/compare/1.1.0...1.2.0) (2019-12-06)


### Features

* **Core-Interface:** Upgrade to 1.4.0 ([984e916](https://github.com/ideal-postcodes/core-node/commit/984e916))

# [1.1.0](https://github.com/ideal-postcodes/core-node/compare/1.0.0...1.1.0) (2019-07-18)


### Docs

* **Readme:** Check against Markdown lint rules and correct grammar ([1c31977](https://github.com/ideal-postcodes/core-node/commit/1c31977))


### Features

* **Agent Configuration:** Allow GOT config ([7d367f7](https://github.com/ideal-postcodes/core-node/commit/7d367f7))

# 1.0.0 (2019-06-09)


### Bug Fixes

* **Error Handling:** HTTP Errors ([79f6021](https://github.com/ideal-postcodes/core-node/commit/79f6021))
* **Test:** Use nock beta ([7354cc8](https://github.com/ideal-postcodes/core-node/commit/7354cc8))
