import { assert } from "chai";
import { Client } from "../lib/client";
import { loadHttpFixtures } from "./fixtures/index";

loadHttpFixtures(__filename);

const SUCCESS = 200;

const api_key = process.env.VALID_API_KEY || "iddqd";
const client = new Client({ api_key });

describe("Client integration test", () => {
  describe("ping", () => {
    it("pings /", async () => {
      const response = await client.ping();
      assert.equal(response.httpStatus, SUCCESS);
    });
  });
});
