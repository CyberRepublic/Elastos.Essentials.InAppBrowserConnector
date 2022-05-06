import type * as didSdk from "@elastosfoundation/did-js-sdk";
import type { JSONObject, VerifiableCredential, VerifiablePresentation } from "@elastosfoundation/did-js-sdk";
import type { connectivity, DID, Wallet } from "@elastosfoundation/elastos-connectivity-sdk-js";
import type { provider } from "web3-core";
import { context } from "./context";
import { DIDOperations } from "./did/did";
import { essentialsBridge } from "./essentialsbridge";

/**
 * Connector generated as a standalone JS file that can be injected into dApps opened from the
 * Essentials dApp browser. This connector is normally injected as a global window.elastos and can then
 * be found by the connectivity SDK as one of the available connectors for elastos operations.
 */
class EssentialsDABConnector /* implements Interfaces.Connectors.IConnector */ {
  public name: string = "essentialsiab";

  async getDisplayName(): Promise<string> {
    return "Elastos Essentials In App Browser";
  }

  getWeb3Provider(): provider {
    // As we are running inside essentials, the web3 provider is injeted
    // into window.ethereum
    return (window as any).ethereum as provider;
  }

  async setModuleContext(didSdkModule: typeof didSdk, connectivityModule: typeof connectivity) {
    context.didSdk = didSdkModule;
    context.connectivity = connectivityModule;
  }

  private ensureContextSet() {
    if (!context.didSdk || !context.connectivity) {
      throw new Error("This dApp uses a old version of the elastos connectivity SDK and must be upgraded to be able to run inside Elastos Essentials");
    }
  }

  /**
   * DID API
   */
  getCredentials(query: DID.GetCredentialsQuery): Promise<VerifiablePresentation> {
    this.ensureContextSet();
    return DIDOperations.getCredentials(query);
  }

  requestCredentials(query: DID.CredentialDisclosureRequest): Promise<VerifiablePresentation> {
    this.ensureContextSet();
    return DIDOperations.requestCredentials(query);
  }

  issueCredential(holder: string, types: string[], subject: JSONObject, identifier?: string, expirationDate?: string): Promise<VerifiableCredential> {
    this.ensureContextSet();
    return DIDOperations.issueCredential(holder, types, subject, identifier, expirationDate);
  }

  importCredentials(credentials: VerifiableCredential[], options?: DID.ImportCredentialOptions): Promise<DID.ImportedCredential[]> {
    this.ensureContextSet();
    return DIDOperations.importCredentials(credentials, options);
  }

  signData(data: string, jwtExtra?: any, signatureFieldName?: string): Promise<DID.SignedData> {
    this.ensureContextSet();
    return DIDOperations.signData(data, jwtExtra, signatureFieldName);
  }

  deleteCredentials(credentialIds: string[], options?: DID.DeleteCredentialOptions): Promise<string[]> {
    this.ensureContextSet();
    return DIDOperations.deleteCredentials(credentialIds, options);
  }

  requestPublish(): Promise<string> {
    // OK. Normally never used, could become deprecated soon, we don't implement for now.
    throw new Error("Method not implemented.");
  }

  generateAppIdCredential(appInstanceDID: string, appDID: string): Promise<any> {
    this.ensureContextSet();
    return DIDOperations.generateAppIdCredential(appInstanceDID, appDID);
  }

  updateHiveVaultAddress(vaultAddress: string, displayName: string): Promise<DID.UpdateHiveVaultAddressStatus> {
    this.ensureContextSet();
    return DIDOperations.updateHiveVaultAddress(vaultAddress, displayName);
  }

  importCredentialContext(serviceName: string, contextCredential: VerifiableCredential): Promise<DID.ImportedCredential> {
    // Ok for now, only used by the credential toolbox, not supposed to be used on mobile.
    throw new Error("importCredentialContext(): Method not implemented.");
  }

  generateHiveBackupCredential(sourceHiveNodeDID: string, targetHiveNodeDID: string, targetNodeURL: string): Promise<VerifiableCredential> {
    this.ensureContextSet();
    return DIDOperations.generateHiveBackupCredential(sourceHiveNodeDID, targetHiveNodeDID, targetNodeURL);
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