/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
module.exports = {
    solidity: "0.8.19",
    paths: {
        // now this is where the contract abi will be
        artifacts: './src/artifacts'

    },
    networks: {
        hardhat: {
            chainId: 1337
        }


    }
};