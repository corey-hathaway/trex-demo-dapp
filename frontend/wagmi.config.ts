import { defineConfig } from "@wagmi/cli";
import { paseoTestnet } from "./src/wagmi-config";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [
    {
      name: "agentManager",
      abi: [
        {
          "inputs": [],
          "name": "getAgent",
          "outputs": [{"internalType": "address", "name": "", "type": "address"}],
          "stateMutability": "view",
          "type": "function"
        }
      ] as const,
      address: {
        [paseoTestnet.id]: "0x493275370aF3f63d9ccd10a6539435121cF4fbb9" as const,
      },
    },
  ],
  plugins: [],
});