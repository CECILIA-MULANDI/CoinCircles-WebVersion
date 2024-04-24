// we need to fetch the contract
import { ContractAddress } from "../constants/constants"
import ContractAbi from "../artifacts/contracts/hello.sol/CoinCircles.json"
import { ethers } from "hardhat"

const fetchContract = (signerorProvider) => {
    new ethers.Contract(ContractAbi, ContractAddress, signerorProvider);

}

export const connectingWithContract = async() => {

}