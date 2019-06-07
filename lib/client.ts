import {
  Client as CoreInterface,
  Config as CoreConfig,
  TLS,
  API_URL,
  VERSION,
  TIMEOUT,
  STRICT_AUTHORISATION,
} from "@ideal-postcodes/core-interface";
import { Agent } from "./agent";

const userAgent = `IdealPostcodes ideal-postcodes/core-node`;

interface Config extends Partial<CoreConfig> {
  api_key: string;
}

export class Client extends CoreInterface {
  constructor(config: Config) {
    const agent = new Agent();
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
