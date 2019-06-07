import * as sinon from "sinon";
import { assert } from "chai";
import { Agent, toHeader } from "../lib/agent";
import { Response } from "got";

describe("Agent", () => {
  let agent: Agent;

  beforeEach(() => {
    agent = new Agent();
  });

  describe("toHeader", () => {
    it("coerces a Got header object into an object of strings", () => {
      const gotHeader = {
        foo: "bar",
        baz: ["quux", "quuux"],
        empty: undefined,
      };
      assert.deepEqual(toHeader(gotHeader), {
        foo: "bar",
        baz: "quux,quuux",
      });
    });
  });

  type HttpVerb = "GET" | "POST";

  describe("http", () => {
    it("delegates http requests to 'got'", async () => {
      const method: HttpVerb = "GET";
      const query = { foo: "bar" };
      const header = { baz: "quux" };
      const url = "http://www.foo.com/";
      const timeout = 1000;
      const SUCCESS = 200;

      const response: unknown = {
        statusCode: SUCCESS,
        headers: header,
        body: Buffer.from("{}"),
        url,
      };

      const stub = sinon
        .stub(agent, "got")
        .resolves(response as Response<Buffer>);

      await agent.http({ method, timeout, url, header, query });

      sinon.assert.calledOnce(stub);
      sinon.assert.calledWithExactly(stub, url, {
        method,
        headers: header,
        query,
        json: true,
        timeout,
      } as any);
    });

    it("provides JSON body with post request", async () => {
      const method: HttpVerb = "POST";
      const query = { foo: "bar" };
      const header = { baz: "quux" };
      const url = "http://www.foo.com/";
      const timeout = 1000;
      const SUCCESS = 200;
      const body = { foo: "bar" };

      const response: unknown = {
        statusCode: SUCCESS,
        headers: header,
        body: Buffer.from("{}"),
        url,
      };

      const stub = sinon
        .stub(agent, "got")
        .resolves(response as Response<Buffer>);

      await agent.http({ body, method, timeout, url, header, query });

      sinon.assert.calledOnce(stub);
      sinon.assert.calledWithExactly(stub, url, {
        method,
        json: true,
        body,
        headers: header,
        query,
        timeout,
      } as any);
    });
  });
});
