import { VerifiablePresentation } from "@elastosfoundation/did-js-sdk";
import { DID } from "@elastosfoundation/elastos-connectivity-sdk-js/typings";
import { GetCredentialsQuery } from "@elastosfoundation/elastos-connectivity-sdk-js/typings/did";
import { essentialsBridge } from "../essentialsbridge";

export class DIDOperations {
  public static async getCredentials(query: GetCredentialsQuery): Promise<VerifiablePresentation> {
    console.log("getCredentials request received", query);

    let response = await essentialsBridge.postMessage<any>("elastos_getCredentials", query);
    console.log("getCredentials Response received", response);
    return VerifiablePresentation.parse(JSON.stringify(response));
  }

  public static async signData(data: string, jwtExtra?: any, signatureFieldName?: string): Promise<DID.SignedData> {
    console.log("signData request received", data, jwtExtra, signatureFieldName);

    let response = await essentialsBridge.postMessage<DID.SignedData>("elastos_signData", {
      data, jwtExtra, signatureFieldName
    });
    console.log("signData Response received", response);
    return response;
  }
}