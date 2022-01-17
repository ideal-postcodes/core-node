import { assert } from "chai";
import { Client, Config } from "../lib/client";
import { Agent } from "../lib/agent";
import { defaults, Config as InterfaceConfig } from "../lib";

describe("Client", () => {
  describe("instantiation", () => {
    let client: Client;
    const api_key = "foo";

    beforeEach(() => {
      client = new Client({ api_key });
    });

    it("assigns default config values", () => {
      assert.equal(client.config.api_key, api_key);
      assert.equal(client.config.tls, defaults.tls);
      assert.equal(client.config.baseUrl, defaults.baseUrl);
      assert.equal(client.config.version, defaults.version);
      assert.equal(
        client.config.strictAuthorisation,
        defaults.strictAuthorisation
      );
      assert.equal(client.config.timeout, defaults.timeout);
    });

    it("allows default config values to be overwritten", () => {
      const options = {
        tls: false,
        api_key,
        baseUrl: "localhost:8008",
        version: "v0",
        strictAuthorisation: true,
        timeout: 2,
      };
      const customClient = new Client(options);
      assert.equal(customClient.config.api_key, options.api_key);
      assert.equal(customClient.config.tls, options.tls);
      assert.equal(customClient.config.baseUrl, options.baseUrl);
      assert.equal(customClient.config.version, options.version);
      assert.equal(
        customClient.config.strictAuthorisation,
        options.strictAuthorisation
      );
      assert.equal(customClient.config.timeout, options.timeout);
      assert.deepEqual((customClient.config.agent as any).gotConfig, {});
    });

    it("assigns user agent header", () => {
      assert.match(client.config.header["User-Agent"], /Core-Node/i);
    });

    it("assigns got config", () => {
      const retry = {
        limit: 2,
      };
      const customClient = new Client({ api_key }, { retry });
      assert.deepEqual((customClient.config.agent as any).gotConfig, { retry });
    });
  });

  describe("Config", () => {
    it("weakly matches interface provided by core-interface", () => {
      const agent = new Agent();
      const header = {};
      // This test will fail to compile if config types are not compatible
      const options = {
        tls: false,
        api_key: "foo",
        baseUrl: "localhost:8008",
        version: "v0",
        strictAuthorisation: true,
        timeout: 2,
        agent,
        header,
      };
      const interfaceConfig: InterfaceConfig = options;
      const config: Config = options;
      assert.deepEqual(config, interfaceConfig);
    });
  });
});
