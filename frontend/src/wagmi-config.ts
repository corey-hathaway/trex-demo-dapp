import { http, createConfig } from "@wagmi/core";
import { type Chain } from "viem";
import { metaMask } from "@wagmi/connectors";

const paseoTestnet = {
  id: 420420420,
  name: "Paseo Testnet (Passet Hub)",
  nativeCurrency: {
    name: "PAS",
    symbol: "PAS",
    decimals: 12
  },
  rpcUrls: {
    default: {
      http: ["https://testnet-passet-hub.polkadot.io"],
      webSocket: ["wss://passet-hub-paseo.ibp.network"]
    }
  },
  blockExplorers: {
    default: {
      name: "Passet Hub Explorer",
      url: "https://blockscout-passet-hub.parity-testnet.parity.io"
    }
  }
} as const satisfies Chain;

export const config = createConfig({
  chains: [paseoTestnet],
  transports: {
    [paseoTestnet.id]: http("https://testnet-passet-hub.polkadot.io", {
      // Configure for Paseo testnet with proper timeout for contract deployments
      batch: false,
      fetchOptions: {
        timeout: 120000, // 2 minutes timeout for large contract deployments
      }
    })
  },
  connectors: [metaMask({
    dappMetadata: {
      name: "T-REX Demo dApp (Paseo Testnet)"
    }
  })]
});
