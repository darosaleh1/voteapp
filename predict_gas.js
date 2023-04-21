const { ethers } = require('ethers');

(async () => {
  // Connect to Ethereum mainnet using a provider
  const provider = new ethers.providers.JsonRpcProvider('https://eth-mainnet.alchemyapi.io/v2/AG_-PDTWJmBnLKRHBptTxJ3mliEx_hRf');

  // Set the bytecode and ABI
  const bytecode = '0xYourContractBytecode';
  const abi = [
    // Your contract ABI array
  ];

  // Create a random signer to estimate the deployment cost
  const signer = ethers.Wallet.createRandom().connect(provider);

  // Create a factory for your contract
  const factory = new ethers.ContractFactory(abi, bytecode, signer);

  // Estimate the gas cost of deploying the contract
  const gasEstimate = await factory.estimateGas.deploy(/* Constructor parameters, if any */);

  console.log(`Estimated deployment gas cost: ${gasEstimate.toString()}`);
})();
