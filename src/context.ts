import type * as didSdk from "@elastosfoundation/did-js-sdk";
import type { connectivity } from "@elastosfoundation/elastos-connectivity-sdk-js";

class Context {
  // Global context references to modules loaded by the main app
  public didSdk: typeof didSdk;
  public connectivity: typeof connectivity;
}

export const context = new Context();