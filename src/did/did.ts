import { DIDURL, JSONObject, VerifiableCredential, VerifiablePresentation } from "@elastosfoundation/did-js-sdk";
import { connectivity, DID } from "@elastosfoundation/elastos-connectivity-sdk-js";
import { essentialsBridge } from "../essentialsbridge";

export class DIDOperations {
  public static async getCredentials(query: DID.GetCredentialsQuery): Promise<VerifiablePresentation> {
    console.log("getCredentials request received", query);

    let response = await essentialsBridge.postMessage<any>("elastos_getCredentials", query);
    console.log("getCredentials response received", response);
    return VerifiablePresentation.parse(JSON.stringify(response));
  }

  public static async requestCredentials(request: DID.CredentialDisclosureRequest): Promise<VerifiablePresentation> {
    console.log("requestCredentials request received", request);

    let response = await this.postEssentialsUrlIntent<{ presentation: string }>(
      "https://did.elastos.net/requestcredentials",
      {
        request
      }
    );
    console.log("requestCredentials response received", response);
    return VerifiablePresentation.parse(response.presentation);
  }

  public static async importCredentials(credentials: VerifiableCredential[], options?: DID.ImportCredentialOptions): Promise<DID.ImportedCredential[]> {
    console.log("importCredentials request received", credentials, options);

    let query = {
      credentials: credentials.map(c => JSON.parse(c.toString()))
    };

    if (options && options.forceToPublishCredentials)
      query["forceToPublishCredentials"] = true;

    let response = await this.postEssentialsUrlIntent<{ importedcredentials: string[] }>(
      "https://did.elastos.net/credimport",
      query
    );

    let importedCredentials: DID.ImportedCredential[];
    importedCredentials = response.importedcredentials.map(credentialUrl => {
      return {
        id: DIDURL.from(credentialUrl)
      }
    });

    console.log("importCredentials response received", response);
    return importedCredentials;
  }

  public static async signData(data: string, jwtExtra?: any, signatureFieldName?: string): Promise<DID.SignedData> {
    console.log("signData request received", data, jwtExtra, signatureFieldName);

    let response = await essentialsBridge.postMessage<DID.SignedData>("elastos_signData", {
      data, jwtExtra, signatureFieldName
    });
    console.log("signData response received", response);
    return response;
  }

  public static async deleteCredentials(credentialIds: string[], options?: DID.DeleteCredentialOptions): Promise<string[]> {
    console.log("deleteCredentials request received", credentialIds, options);

    let response = await this.postEssentialsUrlIntent<{ deletedcredentialsids: string[] }>(
      "https://did.elastos.net/creddelete",
      {
        credentialsids: credentialIds,
        options
      }
    );
    console.log("deleteCredentials response received", response);

    if (!response || !response.deletedcredentialsids) {
      return null;
    }

    return response.deletedcredentialsids;
  }

  public static async generateAppIdCredential(appInstanceDID: string, appDID: string): Promise<VerifiableCredential> {
    console.log("generateAppIdCredential request received", appInstanceDID, appDID);

    let response = await this.postEssentialsUrlIntent<{ credential: string }>(
      "https://did.elastos.net/appidcredissue",
      {
        appinstancedid: appInstanceDID,
        appdid: appDID
      }
    );
    console.log("generateAppIdCredential response received", response);

    if (!response || !response.credential) {
      return null;
    }

    return VerifiableCredential.parse(response.credential);
  }

  public static async updateHiveVaultAddress?(vaultAddress: string, displayName: string): Promise<DID.UpdateHiveVaultAddressStatus> {
    console.log("updateHiveVaultAddress request received", vaultAddress, displayName);

    let response = await this.postEssentialsUrlIntent<{ status: DID.UpdateHiveVaultAddressStatus }>(
      "https://did.elastos.net/sethiveprovider",
      {
        address: vaultAddress,
        name: displayName
      }
    );
    console.log("updateHiveVaultAddress response received", response);

    if (!response || !response.status) {
      return null;
    }

    return response.status;
  }

  public static async issueCredential(holder: string, types: string[], subject: JSONObject, identifier?: string, expirationDate?: string): Promise<VerifiableCredential> {
    console.log("issueCredential request received", holder, types, subject, identifier, expirationDate);

    let response = await this.postEssentialsUrlIntent<{ credential: string }>(
      "https://did.elastos.net/credissue",
      {
        subjectdid: holder,
        types,
        properties: subject,
        identifier,
        expirationDate
      }
    );
    console.log("issueCredential response received", response);

    if (!response || !response.credential) {
      return null;
    }

    return VerifiableCredential.parse(response.credential);
  }

  public static async generateHiveBackupCredential(sourceHiveNodeDID: string, targetHiveNodeDID: string, targetNodeURL: string): Promise<VerifiableCredential> {
    console.log("generateHiveBackupCredential request received", sourceHiveNodeDID, targetHiveNodeDID, targetNodeURL);

    let response = await this.postEssentialsUrlIntent<{ credential: string }>(
      "https://did.elastos.net/hivebackupcredissue",
      {
        sourceHiveNodeDID,
        targetHiveNodeDID,
        targetNodeURL
      }
    );
    console.log("generateHiveBackupCredential response received", response);

    if (!response || !response.credential) {
      return null;
    }

    return VerifiableCredential.parse(response.credential);
  }

  private static async postEssentialsUrlIntent<T>(url: string, params: any): Promise<T> {
    // Append informative caller information to the intent, if available.
    // getApplicationDID() throws an error if called when no app did has been set.
    try {
      params["caller"] = connectivity.getApplicationDID();
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