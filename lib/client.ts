import {
  Client as CoreInterface,
  defaults
} from "@ideal-postcodes/core-interface";
import { Agent, GotConfig } from "./agent";

/**
 * Default user agent string
 */
const USER_AGENT = `IdealPostcodes ideal-postcodes/core-node`;

export interface Config {
  /**
   * Use TLS. Defaults to `true`
   */
  tls?: boolean;
  /**
   * API Key. Used in API helper methods
   */
  api_key: string;
  /**
   * Target API hostname. Defaults to `'api.ideal-postcodes.co.uk'`
   */
  baseUrl?: string;
  /**
   * API version. Defaults to `'v1'`
   */
  version?: string;
  /**
   * Force autocomplete authorisation via HTTP headers only. Defaults to `false`
   */
  strictAuthorisation?: boolean;
  /**
   * Default time in ms before HTTP request timeout. Defaults to 10s (`10000`)
   */
  timeout?: number;
  /**
   * String map specifying default headers
   */
  header?: Record<string, string>;
}

export class Client extends CoreInterface {
  /**
   * Client constructor extends CoreInterface by also accepting an optional got
   * configuration object as the second argument.
   *
   * `got` is the underlying HTTP client that powers core-node. Be careful when
   * configuring `gotConfig` so as not to manually override critical request
   * attributes like method, query, header, etc. `got` confirmation options
   * available here: [github.com/sindresorhus/got#options](https://github.com/sindresorhus/got#options)
   */
  constructor(config: Config, gotConfig: GotConfig = {}) {
    const agent = new Agent(gotConfig);
    const header = { "User-Agent": USER_AGENT };
    const tls = config.tls === undefined ? defaults.tls : config.tls;
    const baseUrl = config.baseUrl === undefined ? defaults.baseUrl : config.baseUrl;
    const version = config.version === undefined ? defaults.version : config.version;
    const strictAuthorisation =
      config.strictAuthorisation === undefined
        ? defaults.strictAuthorisation
        : config.strictAuthorisation;
    const timeout = config.timeout === undefined ? defaults.timeout : config.timeout;

    const { api_key } = config;
    const interfaceConfig = {
      tls,
      api_key,
      baseUrl,
      version,
      strictAuthorisation,
      timeout,
      header: { ...header, ...config.header },
    };
    super({ agent, ...interfaceConfig });
  }
}
