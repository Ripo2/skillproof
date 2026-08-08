import deployment from "../../deployment.json";

export const contractAddress =
  deployment.contractAddress as `0x${string}` | "";
export const explorerBaseUrl = deployment.explorerBaseUrl;
export const contractExplorerUrl = contractAddress
  ? `${explorerBaseUrl}/address/${contractAddress}`
  : explorerBaseUrl;
export const deploymentReady = /^0x[0-9a-fA-F]{40}$/.test(contractAddress);
