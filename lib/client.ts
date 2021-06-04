import {
  Client as CoreInterface,
  Config
} from "@ideal-postcodes/core-interface";
import { Agent, GotConfig } from "./agent";

/**
 * Default user agent string
 */
const USER_AGENT = `IdealPostcodes ideal-postcodes/core-node`;

export { Config };

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
    super({ agent, ...{ ...config, ...{ header }} });
  }
}
