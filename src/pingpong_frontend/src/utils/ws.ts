import IcWebSocket, { generateRandomIdentity } from "ic-websocket-js";
import { canisterId, pingpong_backend } from "../../../declarations/pingpong_backend";
import { AuthClient } from "@dfinity/auth-client";
import { SignIdentity } from "@dfinity/agent";
import { DelegationIdentity } from "@dfinity/identity";
// Production
// const gatewayUrl = "wss://gateway.icws.io";
// const icUrl = "https://icp0.io";

// Local test
const gatewayUrl = "ws://127.0.0.1:8080";
const icUrl = "http://127.0.0.1:4943";

let _identity;

const authClient = await AuthClient.create();
if (await authClient.isAuthenticated()) {
  _identity = authClient.getIdentity() as DelegationIdentity;
  console.log("Authenticated identity:", _identity);
  
  // console.log("Authenticated identity:", _identity);
}

export const ws = new IcWebSocket(gatewayUrl, undefined, {
  canisterId: canisterId,
  canisterActor: pingpong_backend,
  identity: _identity ? _identity as SignIdentity: generateRandomIdentity(),
  networkUrl: icUrl,
});