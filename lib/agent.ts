import { Client } from "./client";
import got, { GotInstance, Response } from "got";
import {
  Agent as IAgent,
  HttpRequest,
  HttpResponse,
} from "@ideal-postcodes/core-interface";

const { IdealPostcodesError } = Client.errors;

interface GotHeaders {
  [key: string]: string | string[] | undefined;
}

interface StringMap {
  [key: string]: string;
}

// Converts a Got header object to one that can be used by the client
export const toHeader = (gotHeaders: GotHeaders): StringMap => {
  return Object.keys(gotHeaders).reduce(
    (headers, key) => {
      const val = gotHeaders[key];
      if (typeof val === "string") {
        headers[key] = val;
      } else if (Array.isArray(val)) {
        headers[key] = val.join(",");
      }
      return headers;
    },
    {} as StringMap
  );
};

const toHttpResponse = (
  httpRequest: HttpRequest,
  response: Response<object>
): HttpResponse => {
  return {
    httpRequest,
    body: response.body,
    httpStatus: response.statusCode || 0,
    header: toHeader(response.headers),
    metadata: { response },
  };
};

const handleError = (error: Error): Promise<never> => {
  const idpcError = new IdealPostcodesError({
    message: `[${error.name}] ${error.message}`,
    httpStatus: 0,
    metadata: { got: error },
  });
  return Promise.reject(idpcError);
};

export class Agent implements IAgent {
  public got: GotInstance;

  constructor() {
    this.got = got;
  }

  private requestWithBody(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body, method, timeout, url, header, query } = httpRequest;
    return this.got(url, {
      method,
      headers: header,
      query,
      json: true,
      throwHttpErrors: false,
      body,
      timeout,
    })
      .then(response => toHttpResponse(httpRequest, response))
      .catch(handleError);
  }

  private request(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { method, timeout, url, header, query } = httpRequest;
    return this.got(url, {
      method,
      headers: header,
      query,
      timeout,
      throwHttpErrors: false,
      json: true,
    })
      .then(response => toHttpResponse(httpRequest, response))
      .catch(handleError);
  }

  public http(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest.body !== undefined)
      return this.requestWithBody(httpRequest);
    return this.request(httpRequest);
  }
}
