import { assert } from "chai";
import { Client } from "../lib/client";
import {
  TLS,
  API_URL,
  VERSION,
  TIMEOUT,
  STRICT_AUTHORISATION,
} from "@ideal-postcodes/core-interface";

describe("Client", () => {
  describe("instantiation", () => {
    let client: Client;
    const api_key = "foo";

    beforeEach(() => {
      client = new Client({ api_key });
    });

    it("assigns default config values", () => {
      assert.equal(client.api_key, api_key);
      assert.equal(client.tls, TLS);
      assert.equal(client.baseUrl, API_URL);
      assert.equal(client.version, VERSION);
      assert.equal(client.strictAuthorisation, STRICT_AUTHORISATION);
      assert.equal(client.timeout, TIMEOUT);
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
      assert.equal(customClient.api_key, options.api_key);
      assert.equal(customClient.tls, options.tls);
      assert.equal(customClient.baseUrl, options.baseUrl);
      assert.equal(customClient.version, options.version);
      assert.equal(
        customClient.strictAuthorisation,
        options.strictAuthorisation
      );
      assert.equal(customClient.timeout, options.timeout);
    });
    it("assigns user agent header", () => {
      assert.match(client.header["User-Agent"], /Core-Node/i);
    });
  });
});
