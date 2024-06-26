import {DIDSession} from "did-session";
import {initSilk} from "@silk-wallet/silk-wallet-sdk"
import {EthereumWebAuth, getAccountId} from "@didtools/pkh-ethereum";
import type {CeramicApi} from "@ceramicnetwork/common";
import type {ComposeClient} from "@composedb/client";

// If you are relying on an injected provider this must be here otherwise you will have a type error.
declare global {
  interface Window {
    ethereum: any;
  }
}

/**
 * Checks localStorage for a stored DID Session. If one is found we authenticate it, otherwise we create a new one.
 * @returns Promise<DID-Session> - The User's authenticated sesion.
 */
export const authenticateCeramic = async (
  ceramic: CeramicApi,
  compose: ComposeClient
) => {
  const sessionStr = localStorage.getItem("did"); // for production you will want a better place than localStorage for your sessions.
  let session;

  if (sessionStr) {
    session = await DIDSession.fromSession(sessionStr);
  }

  if (!session || (session.hasSession && session.isExpired)) {
    if (window.ethereum === null || window.ethereum === undefined) {
      throw new Error("No injected Ethereum provider found.");
    }
    window.ethereum = initSilk()

    try {
      await window.ethereum.login()
    } catch (error) {
      console.log(error)
    }

    // We enable the ethereum provider to get the user's addresses.
    const ethProvider = window.ethereum;
    // request ethereum accounts.
    const addresses = await ethProvider.enable({
      method: "eth_requestAccounts",
    });
    const accountId = await getAccountId(ethProvider, addresses[0]);
    const authMethod = await EthereumWebAuth.getAuthMethod(
      ethProvider,
      accountId
    );

    /**
     * Create DIDSession & provide capabilities that we want to access.
     * @NOTE: Any production applications will want to provide a more complete list of capabilities.
     *        This is not done here to allow you to add more datamodels to your application.
     */
    // TODO: update resources to only provide access to our composities
    session = await DIDSession.authorize(authMethod, {
      resources: ["ceramic://*"],
    });
    // Set the session in localStorage.
    localStorage.setItem("did", session.serialize());
  }

  // Set our Ceramic DID to be our session DID.
  //@ts-ignore
  compose.setDID(session.did);
  //@ts-ignore
  ceramic.did = session.did;
  localStorage.setItem("id", session.did.parent);
  const accounts = await window.ethereum.request({ method: "eth_accounts" });
  return accounts;
};

export const connectWallet = async () => {
  // We enable the ethereum provider to get the user's addresses.
  const ethProvider = window.ethereum;
  // request ethereum accounts.
  const addresses = await ethProvider.enable({
    method: "eth_requestAccounts",
  });
  const accountId = await getAccountId(ethProvider, addresses[0]);
  const authMethod = await EthereumWebAuth.getAuthMethod(
    ethProvider,
    accountId
  );
  return accountId;
};

export const disconnect = async () => {
  if (localStorage.getItem("did")) {
    localStorage.removeItem("did");
  }
  localStorage.removeItem("id");
  localStorage.removeItem("robotDID");
};
