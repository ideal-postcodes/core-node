import got, { GotInstance, Response, GotJSONOptions } from "got";
import {
  Agent as IAgent,
  HttpRequest,
  HttpResponse,
  errors,
} from "@ideal-postcodes/core-interface";
const { IdealPostcodesError } = errors;

interface GotHeaders {
  [key: string]: string | string[] | undefined;
}

/**
 * GotConfig
 *
 * An optional configuration object which is passed to the underlying got http
 * client
 */
export type GotConfig = Partial<GotJSONOptions>;

// Converts a Got header object to one that can be used by the client
export const toHeader = (gotHeaders: GotHeaders): Record<string, string> => {
  return Object.keys(gotHeaders).reduce<Record<string, string>>(
    (headers, key) => {
      const val = gotHeaders[key];
      if (typeof val === "string") {
        headers[key] = val;
      } else if (Array.isArray(val)) {
        headers[key] = val.join(",");
      }
      return headers;
    },
    {}
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
  public gotConfig: GotConfig;

  constructor(gotConfig: GotConfig = {}) {
    this.got = got;
    this.gotConfig = gotConfig;
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
      ...this.gotConfig,
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
      ...this.gotConfig,
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
