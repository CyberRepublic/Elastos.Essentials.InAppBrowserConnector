import { JSONObject, VerifiableCredential, VerifiablePresentation } from "@elastosfoundation/did-js-sdk";
import { DID, Interfaces } from "@elastosfoundation/elastos-connectivity-sdk-js";
import { GetCredentialsQuery } from "@elastosfoundation/elastos-connectivity-sdk-js/typings/did";
import { TransactionResult } from "@elastosfoundation/elastos-connectivity-sdk-js/typings/wallet";
import { DIDOperations } from "./did/did";
import { essentialsBridge } from "./essentialsbridge";

/**
 * Connector generated as a standalone JS file that can be injected into dApps opened from the
 * Essentials dApp browser. This connector is normally injected as a global window.elastos and can then
 * be found by the connectivity SDK as one of the available connectors for elastos operations.
 */
class EssentialsDABConnector implements Interfaces.Connectors.IConnector {
  public name: string = "essentialsiab";

  async getDisplayName(): Promise<string> {
    return "Elastos Essentials In App Browser";
  }

  /**
   * DID API
   */
  async getCredentials(query: GetCredentialsQuery): Promise<VerifiablePresentation> {
    return DIDOperations.getCredentials(query);
  }

  issueCredential(holder: string, types: string[], subject: JSONObject, identifier?: string, expirationDate?: string): Promise<VerifiableCredential> {
    throw new Error("Method not implemented.");
  }

  importCredentials(credentials: VerifiableCredential[], options?: DID.ImportCredentialOptions): Promise<DID.ImportedCredential[]> {
    throw new Error("Method not implemented.");
  }

  signData(data: string, jwtExtra?: any, signatureFieldName?: string): Promise<DID.SignedData> {
    throw new Error("Method not implemented.");
  }

  deleteCredentials(credentialIds: string[], options?: DID.DeleteCredentialOptions): Promise<string[]> {
    throw new Error("Method not implemented.");
  }

  requestPublish(): Promise<string> {
    throw new Error("Method not implemented.");
  }

  generateAppIdCredential(appInstanceDID: string, appDID: string): Promise<any> {
    throw new Error("Method not implemented.");
  }

  pay(query: any): Promise<TransactionResult> {
    throw new Error("Method not implemented.");
  }

  voteForDPoS(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  voteForCRCouncil(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  voteForCRProposal(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  sendSmartContractTransaction(payload: any): Promise<string> {
    throw new Error("Method not implemented.");
  }

  public sendResponse(id: number, result: any): void {
    essentialsBridge.sendResponse(id, result);
  }

  public sendError(id: number, error: string) {
    essentialsBridge.sendError(id, error);
  }
}

// Expose this class globally to be able to create instances from the browser dApp.
window["EssentialsDABConnector"] = EssentialsDABConnector;