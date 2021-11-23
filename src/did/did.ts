import { VerifiableCredential, VerifiablePresentation } from "@elastosfoundation/did-js-sdk";
import { DID } from "@elastosfoundation/elastos-connectivity-sdk-js";
import { essentialsBridge } from "../essentialsbridge";

export class DIDOperations {
  public static async getCredentials(query: DID.GetCredentialsQuery): Promise<VerifiablePresentation> {
    console.log("getCredentials request received", query);

    let response = await essentialsBridge.postMessage<any>("elastos_getCredentials", query);
    console.log("getCredentials response received", response);
    return VerifiablePresentation.parse(JSON.stringify(response));
  }

  public static async requestCredentials(query: DID.CredentialDisclosureRequest): Promise<VerifiablePresentation> {
    console.log("requestCredentials request received", query);

    let response = await essentialsBridge.postMessage<any>("elastos_requestCredentials", query);
    console.log("requestCredentials response received", response);
    return VerifiablePresentation.parse(JSON.stringify(response));
  }

  public static async importCredentials(credentials: VerifiableCredential[], options?: DID.ImportCredentialOptions): Promise<DID.ImportedCredential[]> {
    console.log("importCredentials request received", credentials, options);

    let response = await essentialsBridge.postMessage<any>("elastos_importCredentials", {
      credentials: credentials.map(c => c.toString()),
      options
    });
    console.log("importCredentials response received", response);
    return response;
  }

  public static async signData(data: string, jwtExtra?: any, signatureFieldName?: string): Promise<DID.SignedData> {
    console.log("signData request received", data, jwtExtra, signatureFieldName);

    let response = await essentialsBridge.postMessage<DID.SignedData>("elastos_signData", {
      data, jwtExtra, signatureFieldName
    });
    console.log("signData response received", response);
    return response;
  }
}