import { http, createConfig } from "@wagmi/core";
import { type Chain } from "viem";
import { metaMask } from "@wagmi/connectors";

const assetHub = {
  id: 420420420,
  name: "Passet Hub",
  nativeCurrency: {
    name: "PAS",
    symbol: "PAS",
    decimals: 12
  },
  rpcUrls: {
    default: {
      http: ["http://localhost:8545"]
    }
  }
} as const satisfies Chain;

export const config = createConfig({
  chains: [assetHub],
  transports: {
    [assetHub.id]: http()
  },
  connectors: [metaMask({
    dappMetadata: {
      name: "create-polkadot-dapp"
    }
  })]
});
