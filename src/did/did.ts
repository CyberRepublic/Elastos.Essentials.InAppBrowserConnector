import { VerifiablePresentation } from "@elastosfoundation/did-js-sdk";
import { GetCredentialsQuery } from "@elastosfoundation/elastos-connectivity-sdk-js/typings/did";
import { essentialsBridge } from "../essentialsbridge";

export class DIDOperations {
  public static async getCredentials(query: GetCredentialsQuery): Promise<VerifiablePresentation> {
    console.log("getCredentials Request received", query);

    let response = await essentialsBridge.postMessage<any>("elastos_getCredentials", query);
    console.log("getCredentials Response received", response);
    return VerifiablePresentation.parseContent(JSON.stringify(response));
  }
}