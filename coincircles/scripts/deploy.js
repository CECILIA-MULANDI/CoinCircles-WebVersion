// deploy.js
const { ethers } = require("hardhat");

async function main() {
    try {
        const [deployer] = await ethers.getSigners();

        console.log("Deploying contracts with the account:", deployer.address);

        const CoinCircles = await ethers.getContractFactory("CoinCircles");
        const CoinCirclesContract = await CoinCircles.deploy();
        const contract_address = await CoinCirclesContract.getAddress();

        console.log("CoinCircles contract address:", contract_address);
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