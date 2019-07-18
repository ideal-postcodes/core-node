import * as sinon from "sinon";
import { assert } from "chai";
import { Agent, toHeader } from "../lib/agent";
import { Response } from "got";
import { Client } from "../lib/client";

const { IdealPostcodesError } = Client.errors;

describe("Agent", () => {
  let agent: Agent;

  beforeEach(() => {
    agent = new Agent();
  });

  describe("Agent class", () => {
    it("allows for optional got configuration", () => {
      const a = new Agent();
      assert.deepEqual(a.gotConfig, {});
    });

    it("assigns GOT config", () => {
      const retry = 2;
      const a = new Agent({ retry });
      assert.deepEqual({ retry }, a.gotConfig);
    });
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
        throwHttpErrors: false,
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
        throwHttpErrors: false,
        json: true,
        body,
        headers: header,
        query,
        timeout,
      } as any);
    });

    it("handles status code 0f 0", async () => {
      const url = "http://www.foo.com/";

      const response: unknown = {
        headers: {},
        body: Buffer.from("{}"),
        url,
      };

      const stub = sinon
        .stub(agent, "got")
        .resolves(response as Response<Buffer>);

      const apiResponse = await agent.http({
        method: "GET",
        timeout: 1000,
        url,
        header: {},
        query: {},
      });

      assert.equal(apiResponse.httpStatus, 0);

      sinon.assert.calledOnce(stub);
      sinon.assert.calledWithExactly(stub, url, {
        method: "GET",
        throwHttpErrors: false,
        headers: {},
        query: {},
        json: true,
        timeout: 1000,
      } as any);
    });

    describe("GOT Configuration", () => {
      const timeout = 2000;
      const retry = 2;

      beforeEach(() => {
        agent = new Agent({ timeout, retry });
      });

      it("overrides HTTP configuration for GET requests", async () => {
        const method: HttpVerb = "GET";
        const query = { foo: "bar" };
        const header = { baz: "quux" };
        const url = "http://www.foo.com/";
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

        await agent.http({ method, timeout: 1000, url, header, query });

        sinon.assert.calledOnce(stub);
        sinon.assert.calledWithExactly(stub, url, {
          method,
          headers: header,
          throwHttpErrors: false,
          query,
          json: true,
          timeout,
          retry,
        } as any);
      });

      it("overrides HTTP configuration for POST requests", async () => {
        const method: HttpVerb = "POST";
        const query = { foo: "bar" };
        const header = { baz: "quux" };
        const url = "http://www.foo.com/";
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

        await agent.http({ body, method, timeout: 1000, url, header, query });

        sinon.assert.calledOnce(stub);
        sinon.assert.calledWithExactly(stub, url, {
          method,
          throwHttpErrors: false,
          json: true,
          body,
          headers: header,
          query,
          retry,
          timeout,
        } as any);
      });
    });
  });

  describe("Error handling", () => {
    it("wraps non-HTTP got errors", async () => {
      const url = "http://www.foo.com/";

      const response: unknown = {
        headers: {},
        body: Buffer.from("{}"),
        url,
      };

      const genericError = new Error("Generic error");

      const stub = sinon.stub(agent, "got").rejects(genericError);

      try {
        await agent.http({
          method: "GET",
          timeout: 1000,
          url,
          header: {},
          query: {},
        });
      } catch (error) {
        assert.instanceOf(error, IdealPostcodesError);
        assert.equal(error.metadata.got, genericError);
        assert.equal(error.message, "[Error] Generic error");
        return;
      }

      throw new Error("This should be unreachable");
    });

    it("wraps non-HTTP got errors from HTTP requests with body", async () => {
      const url = "http://www.foo.com/";

      const response: unknown = {
        headers: {},
        body: Buffer.from("{}"),
        url,
      };

      const genericError = new Error("Generic error");

      const stub = sinon.stub(agent, "got").rejects(genericError);

      try {
        await agent.http({
          method: "POST",
          timeout: 1000,
          body: { foo: "bar" },
          url,
          header: {},
          query: {},
        });
      } catch (error) {
        assert.instanceOf(error, IdealPostcodesError);
        assert.equal(error.metadata.got, genericError);
        assert.equal(error.message, "[Error] Generic error");
        return;
      }

      throw new Error("This should be unreachable");
    });
  });
});
