import got, { Got, Response, GotOptions } from "got";
import {
  Agent as IAgent,
  HttpRequest,
  HttpResponse,
  errors,
} from "@ideal-postcodes/core-interface";
import queryString from "querystring";
import { URL } from 'url';
const { IdealPostcodesError } = errors;

const {
  /**
   * Ideal Postcodes base error class implemented in [core-interface](https://core-interface.ideal-postcodes.dev/classes/idealpostcodeserror.html)
   */
  IdealPostcodesError,
} = errors;

// @hidden
interface GotHeaders {
  [key: string]: string | string[] | undefined;
}

/**
 * An optional configuration object which is passed to the underlying got http
 * client
 *
 * `got` is the underlying HTTP client that powers core-node. Be careful when
 * configuring `gotConfig` so as not to manually override critical request
 * attributes like method, query, header, etc. `got` confirmation options
 * available here: [github.com/sindresorhus/got#options](https://github.com/sindresorhus/got#options)
 */
export type GotConfig = Partial<GotOptions>;

/**
 * @hidden
 */
interface ToHeader {
  (gotHeaders: GotHeaders): Record<string, string>;
}

/**
 * Converts a Got header object to one that can be used by the client
 *
 * @hidden
 */
export const toHeader: ToHeader = gotHeaders =>
  Object.keys(gotHeaders).reduce<Record<string, string>>((headers, key) => {
    const val = gotHeaders[key];
    if (typeof val === "string") {
      headers[key] = val;
    } else if (Array.isArray(val)) {
      headers[key] = val.join(",");
    }
    return headers;
  }, {});

/**
 * Adapts got responses to a format consumable by core-interface
 *
 * @hidden
 */
const toHttpResponse = (
  httpRequest: HttpRequest,
  response: Response<object>
): HttpResponse => ({
  httpRequest,
  body: response.body,
  httpStatus: response.statusCode || 0,
  header: toHeader(response.headers),
  metadata: { response },
});

/**
 * Catch non-response errors (e.g. network failure, DNS failure, timeout)
 * wrap in our Error class and return
 *
 * @hidden
 */
const handleError = (error: Error): Promise<never> => {
  const idpcError = new IdealPostcodesError({
    message: `[${error.name}] ${error.message}`,
    httpStatus: 0,
    metadata: { got: error },
  });
  return Promise.reject(idpcError);
};

/**
 * Agent
 *
 * Implements node.js HTTP agent for core-interface client
 *
 * @hidden
 */
export class Agent implements IAgent {
  public got: Got;
  public gotConfig: GotConfig;

  constructor(gotConfig: GotConfig = {}) {
    this.got = got;
    this.gotConfig = gotConfig;
  }

  private requestWithBody(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body, method, timeout, url, header, query } = httpRequest;
    const Uri = new URL(url);
    Uri.search = '?' + queryString.stringify(query);

    //check body type to replace the proper values
    //or convert body to buffer

    // @ts-ignore
    return this.got({
      url: Uri,
      method,
      headers: header,
      throwHttpErrors: false,
      body,
      timeout,
      ...this.gotConfig,
    })
      .then((response: Response<object>) => toHttpResponse(httpRequest, response))
      .catch(handleError);
  }

  private request(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { method, timeout, url, header, query } = httpRequest;
    const Uri = new URL(url);
    Uri.search = '?' + queryString.stringify(query);
    // @ts-ignore
    return this.got({
      url: Uri,
      method,
      headers: header,
      timeout,
      throwHttpErrors: false,
      ...this.gotConfig,
    })
    .then((response: Response<object>) => toHttpResponse(httpRequest, response))
    .catch(handleError);
  }

  public http(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest.body !== undefined)
      return this.requestWithBody(httpRequest);
    return this.request(httpRequest);
  }
}
