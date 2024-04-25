const { ethers } = require("hardhat");

async function main() {
    try {
        // Get the ContractFactory for your Solidity contract
        const CoinCircles = await ethers.getContractFactory("CoinCircles");

        // Get the signer (wallet) to use for deploying the contract
        const accounts = await ethers.getSigners();
        const deployer = accounts[0]; // Assuming you want to deploy from the first account

        // Deploy the contract using the signer
        const CoinCirclesContract = await CoinCircles.deploy();
        await CoinCirclesContract.deployed();

        // Get the deployed contract's address
        const contractAddress = CoinCirclesContract.address;

        console.log("CoinCircles contract deployed to:", contractAddress);
    } catch (error) {
        console.error("Error deploying contract:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error("Error in main function:", error);
        process.exit(1);
    });