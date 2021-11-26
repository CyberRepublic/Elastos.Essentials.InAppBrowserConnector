import { JSONObject, VerifiableCredential, VerifiablePresentation } from "@elastosfoundation/did-js-sdk";
import { DID, Interfaces, Wallet } from "@elastosfoundation/elastos-connectivity-sdk-js";
import { provider } from "web3-core";
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

  getWeb3Provider(): provider {
    // As we are running inside essentials, the web3 provider is injeted
    // into window.ethereum
    return (window as any).ethereum as provider;
  }

  /**
   * DID API
   */
  getCredentials(query: DID.GetCredentialsQuery): Promise<VerifiablePresentation> {
    return DIDOperations.getCredentials(query);
  }

  requestCredentials(query: DID.CredentialDisclosureRequest): Promise<VerifiablePresentation> {
    return DIDOperations.requestCredentials(query);
  }

  issueCredential(holder: string, types: string[], subject: JSONObject, identifier?: string, expirationDate?: string): Promise<VerifiableCredential> {
    throw new Error("Method not implemented.");
  }

  importCredentials(credentials: VerifiableCredential[], options?: DID.ImportCredentialOptions): Promise<DID.ImportedCredential[]> {
    return DIDOperations.importCredentials(credentials, options);
  }

  signData(data: string, jwtExtra?: any, signatureFieldName?: string): Promise<DID.SignedData> {
    return DIDOperations.signData(data, jwtExtra, signatureFieldName);
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

  pay(query: any): Promise<Wallet.TransactionResult> {
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