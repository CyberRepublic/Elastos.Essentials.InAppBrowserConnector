import { context } from "./context";
import { essentialsBridge } from "./essentialsbridge";

/**
 * IMPORTANT NOTE: This internal essentials connector must NOT use the DID JS SDK and Connectivity SDK
 * classes directly because otherwise this conflicst with those SDKs imported by the running apps. If
 * multiple versions of those SDKs are in use in the same webview, webpack loader mixes SDK classes in a wrong
 * way, and type checks such as "myVar instanceof DID" sometimes works, sometimes doesn't, because there are
 * multiple versions of the "DID" class that are actually not "the same".
 *
 * So the trick to access DID SDK and Connectivity SDK methods here is to make the connectivity SDK provide
 * references to those modules, loaded from the main app bundle, and use them in this connector without bundling
 * anything.
 */
export class UXOperations {
  public static async onBoard(feature: string, title: string, introduction: string, button: string): Promise<void> {
    console.log("onBoard request received", feature, title, introduction, button);

    await this.postEssentialsUrlIntent<void>(
      "https://essentials.elastos.net/onboard",
      {
        feature,
        title, introduction, button
      }
    );
  }

  private static async postEssentialsUrlIntent<T>(url: string, params: any): Promise<T> {
    // Append informative caller information to the intent, if available.
    // getApplicationDID() throws an error if called when no app did has been set.
    try {
      params["caller"] = context.connectivity.getApplicationDID();
    }
    catch {
      // Silent catch, it's ok
    }

    return essentialsBridge.postMessage<T>("elastos_essentials_url_intent", {
      url,
      params
    });
  }
}