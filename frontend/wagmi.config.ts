import { defineConfig, ContractConfig } from "@wagmi/cli";
import { Abi } from "viem";
import fs from "fs";
import path from "path";

let dirEntries: fs.Dirent[] = [];

const deploymentsDir = path.join("..", "T-REX", "deployment");
const artifactsDir = path.join("..", "T-REX", "artifacts-pvm", "contracts");
const onchainIdArtifactsDir = path.join("..", "T-REX", "solidity", "artifacts-pvm", "contracts");

let deploymentEntries: fs.Dirent[] = [];
let artifactEntries: fs.Dirent[] = [];
let onchainIdArtifactEntries: fs.Dirent[] = [];

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

try {
  onchainIdArtifactEntries.push(
    ...fs.readdirSync(onchainIdArtifactsDir, { recursive: true, withFileTypes: true })
  );
} catch (e: unknown) {
  if (!(e instanceof Error && "code" in e && e.code === "ENOENT")) {
    throw e;
  }

  console.warn(`No OnchainID artifact files found in ${onchainIdArtifactsDir}. Compile OnchainID contracts first.`);
  // Don't exit here - OnchainID artifacts are optional
}

const deployedAddressesEntries = deploymentEntries.filter((entry) => entry.isFile() && entry.name.endsWith(".json") && !entry.name.endsWith(".dbg.json"));

const contractArtifacts = artifactEntries.filter(
  (entry) => entry.isFile() && entry.name.endsWith(".json") && !entry.name.endsWith(".dbg.json")
);

const onchainIdContractArtifacts = onchainIdArtifactEntries.filter(
  (entry) => entry.isFile() && entry.name.endsWith(".json") && !entry.name.endsWith(".dbg.json")
);

if (contractArtifacts.length === 0) {
  console.warn(`No contract artifacts found in ${artifactsDir}. Compile contracts first.`);
  process.exit(1);
}

const abisByContractName: Record<string, Abi> = {};

// Process main T-REX artifacts
for (const entry of contractArtifacts) {
  const fileContents = fs.readFileSync(path.join(entry.parentPath, entry.name), "utf-8");
  const artifactData = JSON.parse(fileContents);
  
  if (artifactData.contractName) {
    abisByContractName[artifactData.contractName] = artifactData.abi as Abi;
    console.log(`Loaded T-REX ABI for contract: ${artifactData.contractName}`);
  } else {
    console.warn(`No contractName found in T-REX artifact: ${entry.name}`);
  }
}

// Process OnchainID artifacts
for (const entry of onchainIdContractArtifacts) {
  const fileContents = fs.readFileSync(path.join(entry.parentPath, entry.name), "utf-8");
  const artifactData = JSON.parse(fileContents);
  
  if (artifactData.contractName) {
    abisByContractName[artifactData.contractName] = artifactData.abi as Abi;
    console.log(`Loaded OnchainID ABI for contract: ${artifactData.contractName}`);
  } else {
    console.warn(`No contractName found in OnchainID artifact: ${entry.name}`);
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
  "claimIssuerContract": "ClaimIssuer",
  "trexFactory": "TREXFactory",
  "identityFactory": "IdFactory",
  "trexImplementationAuthority": "TREXImplementationAuthority",
  "identityImplementationAuthority": "ImplementationAuthority",
  "identityImplementation": "Identity",
  "claimTopicsRegistryImplementation": "ClaimTopicsRegistry",
  "trustedIssuersRegistryImplementation": "TrustedIssuersRegistry",
  "identityRegistryStorageImplementation": "IdentityRegistryStorage", 
  "identityRegistryImplementation": "IdentityRegistry",
  "modularComplianceImplementation": "ModularCompliance",
  "tokenImplementation": "Token"
};

// Additional proxy contracts needed for direct deployment
const additionalProxyContracts = [
  "TokenProxy",
  "IdentityRegistryProxy", 
  "ModularComplianceProxy",
  "ClaimTopicsRegistryProxy",
  "TrustedIssuersRegistryProxy",
  "IdentityRegistryStorageProxy"
];

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

  // Helper function to process contract sections
  const processContractSection = (sectionName: string, contracts: Record<string, string>) => {
    console.log(`Processing ${sectionName} contracts for chain ${chainId}:`, Object.keys(contracts));
    for (const [deploymentName, address] of Object.entries(contracts) as [ContractName, `0x${string}`][]) {
      // Map deployment name to artifact contract name
      const artifactContractName = contractNameMapping[deploymentName];
      if (!artifactContractName) {
        console.warn(`No mapping found for deployment name ${deploymentName} in ${sectionName} section, chain ${chainId}, skipping...`);
        continue;
      }
      
      console.log(`Mapping ${sectionName}.${deploymentName} -> ${artifactContractName}`);
      
      const abi = abisByContractName[artifactContractName];
      if (!abi) {
        console.warn(`No ABI found for contract ${artifactContractName} (mapped from ${sectionName}.${deploymentName}) in chain ${chainId}, skipping...`);
        continue;
      }

      if (!deployedContracts[deploymentName]) deployedContracts[deploymentName] = { name: deploymentName, abi, address: {} };
      const addressMap = deployedContracts[deploymentName].address! as Record<number, `0x${string}`>;
      addressMap[parseInt(chainId)] = address;
      console.log(`Successfully mapped contract ${deploymentName} from ${sectionName} for chain ${chainId}`);
    }
  };

  // Process all contract sections from the deployment data
  if (deploymentData.suite) {
    processContractSection('suite', deploymentData.suite);
  }
  
  if (deploymentData.factories) {
    processContractSection('factories', deploymentData.factories);
  }
  
  if (deploymentData.authorities) {
    processContractSection('authorities', deploymentData.authorities);
  }
  
  if (deploymentData.implementations) {
    processContractSection('implementations', deploymentData.implementations);
  }
}

// Add additional proxy contracts that aren't in deployment data but are needed for direct deployment
for (const contractName of additionalProxyContracts) {
  if (abisByContractName[contractName]) {
    const contractKey = contractName.toLowerCase();
    deployedContracts[contractKey] = {
      name: contractKey,
      abi: abisByContractName[contractName],
      // No address since these are for deployment, not interaction with existing contracts
      address: undefined
    };
    console.log(`Added proxy contract ABI: ${contractName}`);
  } else {
    console.warn(`Proxy contract ABI not found: ${contractName}`);
  }
}

// Debug logging
console.log(`Found ${deploymentEntries.length} deployment entries`);
console.log(`Found ${artifactEntries.length} T-REX artifact entries`);
console.log(`Found ${onchainIdArtifactEntries.length} OnchainID artifact entries`);
console.log(`Found ${deployedAddressesEntries.length} deployment address files`);
console.log(`Found ${contractArtifacts.length} T-REX contract artifacts`);
console.log(`Found ${onchainIdContractArtifacts.length} OnchainID contract artifacts`);

if (process.env.DEBUG === "1") {
  console.log("deployedAddressesEntries", deployedAddressesEntries);
  console.log("contractArtifacts", contractArtifacts);
  console.log("deployedAddresses", deployedContracts);
}

export default defineConfig({
  out: "src/generated.ts", contracts: Object.values(deployedContracts), plugins: []
});
