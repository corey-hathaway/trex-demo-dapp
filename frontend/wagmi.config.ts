import { defineConfig, ContractConfig } from "@wagmi/cli";
import { Abi } from "viem";
import fs from "fs";
import path from "path";

let dirEntries: fs.Dirent[] = [];

const deploymentsDir = path.join("..", "T-REX", "deployment");
const artifactsDir = path.join("..", "T-REX", "artifacts-pvm", "contracts");

let deploymentEntries: fs.Dirent[] = [];
let artifactEntries: fs.Dirent[] = [];

try {
  deploymentEntries.push(
    ...fs.readdirSync(deploymentsDir, { recursive: true, withFileTypes: true })
  );
} catch (e: unknown) {
  if (!(e instanceof Error && "code" in e && e.code === "ENOENT")) {
    throw e;
  }

  console.warn(`No deployment files found in ${deploymentsDir}. Deploy contracts first.`);
  process.exit(1);
}

try {
  artifactEntries.push(
    ...fs.readdirSync(artifactsDir, { recursive: true, withFileTypes: true })
  );
} catch (e: unknown) {
  if (!(e instanceof Error && "code" in e && e.code === "ENOENT")) {
    throw e;
  }

  console.warn(`No artifact files found in ${artifactsDir}. Compile contracts first.`);
  process.exit(1);
}

const deployedAddressesEntries = deploymentEntries.filter((entry) => entry.isFile() && entry.name.endsWith(".json") && !entry.name.endsWith(".dbg.json"));

const contractArtifacts = artifactEntries.filter(
  (entry) => entry.isFile() && entry.name.endsWith(".json") && !entry.name.endsWith(".dbg.json")
);

if (contractArtifacts.length === 0) {
  console.warn(`No contract artifacts found in ${artifactsDir}. Compile contracts first.`);
  process.exit(1);
}

const abisByContractName: Record<string, Abi> = {};

for (const entry of contractArtifacts) {
  const fileContents = fs.readFileSync(path.join(entry.parentPath, entry.name), "utf-8");
  const artifactData = JSON.parse(fileContents);
  
  if (artifactData.contractName) {
    abisByContractName[artifactData.contractName] = artifactData.abi as Abi;
    console.log(`Loaded ABI for contract: ${artifactData.contractName}`);
  } else {
    console.warn(`No contractName found in artifact: ${entry.name}`);
  }
}

type ContractName = string;
const deployedContracts: Record<ContractName, ContractConfig> = {};

// Contract name mapping between deployment names and artifact contract names
const contractNameMapping: Record<string, string> = {
  "token": "Token",
  "identityRegistry": "IdentityRegistry",
  "identityRegistryStorage": "IdentityRegistryStorage", 
  "trustedIssuersRegistry": "TrustedIssuersRegistry",
  "claimTopicsRegistry": "ClaimTopicsRegistry",
  "defaultCompliance": "ModularCompliance",
  "agentManager": "AgentRole",
  "tokenOID": "IdFactoryMock",
  "claimIssuerContract": "ClaimIssuerContract"
};

// Extract chain ID from filename (e.g., "420420420.json" -> "420420420")
for (const entry of deployedAddressesEntries) {
  const chainId = entry.name.replace(/\.json$/, "");
  if (!chainId || isNaN(parseInt(chainId))) {
    throw new Error(`Invalid chain ID in filename: ${entry.name}`);
  }
  
  const fileContents = fs.readFileSync(path.join(entry.parentPath, entry.name), "utf-8");
  const deploymentData = JSON.parse(fileContents);
  
  // Verify chain ID in JSON content matches filename
  if (deploymentData.chainId !== parseInt(chainId)) {
    throw new Error(`Chain ID mismatch: filename ${chainId} vs JSON content ${deploymentData.chainId}`);
  }

  // Process suite contracts from the deployment data
  if (deploymentData.suite) {
    console.log(`Processing suite contracts for chain ${chainId}:`, Object.keys(deploymentData.suite));
    for (const [deploymentName, address] of Object.entries(deploymentData.suite) as [ContractName, `0x${string}`][]) {
      // Map deployment name to artifact contract name
      const artifactContractName = contractNameMapping[deploymentName];
      if (!artifactContractName) {
        console.warn(`No mapping found for deployment name ${deploymentName} in chain ${chainId}, skipping...`);
        continue;
      }
      
      console.log(`Mapping ${deploymentName} -> ${artifactContractName}`);
      
      const abi = abisByContractName[artifactContractName];
      if (!abi) {
        console.warn(`No ABI found for contract ${artifactContractName} (mapped from ${deploymentName}) in chain ${chainId}), skipping...`);
        continue;
      }

      if (!deployedContracts[deploymentName]) deployedContracts[deploymentName] = { name: deploymentName, abi, address: {} };
      const addressMap = deployedContracts[deploymentName].address! as Record<number, `0x${string}`>;
      addressMap[parseInt(chainId)] = address;
      console.log(`Successfully mapped contract ${deploymentName} for chain ${chainId}`);
    }
  }
}

// Debug logging
console.log(`Found ${deploymentEntries.length} deployment entries`);
console.log(`Found ${artifactEntries.length} artifact entries`);
console.log(`Found ${deployedAddressesEntries.length} deployment address files`);
console.log(`Found ${contractArtifacts.length} contract artifacts`);

if (process.env.DEBUG === "1") {
  console.log("deployedAddressesEntries", deployedAddressesEntries);
  console.log("contractArtifacts", contractArtifacts);
  console.log("deployedAddresses", deployedContracts);
}

export default defineConfig({
  out: "src/generated.ts", contracts: Object.values(deployedContracts), plugins: []
});
