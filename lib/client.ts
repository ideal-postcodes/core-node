import {
  Client as CoreInterface,
  Config as CoreConfig,
  TLS,
  API_URL,
  VERSION,
  TIMEOUT,
  STRICT_AUTHORISATION,
} from "@ideal-postcodes/core-interface";
import { Agent, GotConfig } from "./agent";

const userAgent = `IdealPostcodes ideal-postcodes/core-node`;

interface Config extends Partial<CoreConfig> {
  api_key: string;
}

export class Client extends CoreInterface {
  /**
   * Client constructor extends CoreInterface by also accepting an optional got
   * configuration object as the second argument.
   *
   * got is the underlying HTTP client that powers core-node. Be careful when
   * configuring gotConfig so as not to manually override critical request
   * attributes like method, query, header, etc.
   */
  constructor(config: Config, gotConfig: GotConfig = {}) {
    const agent = new Agent(gotConfig);
    const header = { "User-Agent": userAgent };
    const tls = config.tls === undefined ? TLS : config.tls;
    const baseUrl = config.baseUrl === undefined ? API_URL : config.baseUrl;
    const version = config.version === undefined ? VERSION : config.version;
    const strictAuthorisation =
      config.strictAuthorisation === undefined
        ? STRICT_AUTHORISATION
        : config.strictAuthorisation;
    const timeout = config.timeout === undefined ? TIMEOUT : config.timeout;

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
    super({ agent, header, ...interfaceConfig });
  }
}
