// deploy.js
const { ethers } = require("hardhat");

async function main() {
    try {
        const [deployer] = await ethers.getSigners();

        console.log("Deploying contracts with the account:", deployer.address);

        const Hello = await ethers.getContractFactory("Hello");
        const helloContract = await Hello.deploy();
        const contract_address = await helloContract.getAddress();

        console.log("Hello contract address:", contract_address);
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