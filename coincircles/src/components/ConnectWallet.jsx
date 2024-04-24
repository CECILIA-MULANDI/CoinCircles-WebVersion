import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { ethers } from 'ethers';
import { ContractAddress } from '../constants/constants';
import contractAbi from "../artifacts/contracts/hello.sol/CoinCircles.json";

export default function ConnectWallet() {
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [contract, setContract] = useState(null);
  
    useEffect(() => {
      const connectToContract = async () => {
        if (window.ethereum) {
          try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contractAddress = ethers.utils.getAddress(ContractAddress);
            const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer);
            setContract(contract);
          } catch (error) {
            console.error('Error connecting to contract:', error);
          }
        } else {
          setErrorMessage('Kindly install MetaMask');
        }
      };
  
      connectToContract();
    }, []);
  
    const connectWallet = async () => {
      try {
        if (contract && window.ethereum) { // Check if contract is not null
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send('eth_requestAccounts', []);
          const signer = provider.getSigner();
          const userAddress = await signer.getAddress();
          accountChanged(userAddress);
          // Call your contract's connect_user function
          await contract.connect_user();
        } else {
          setErrorMessage('Kindly install MetaMask or wait for contract to load');
        }
      } catch (error) {
        setErrorMessage('Error connecting to wallet');
        console.error(error);
      }
    };
  
    const accountChanged = (accountName) => {
      setDefaultAddress(accountName);
    };
  
    return (
      <>
        <Button onClick={connectWallet} disabled={!contract}>Connect Wallet</Button>
        <h3>Address: {defaultAddress}</h3>
        {errorMessage && <p>{errorMessage}</p>}
      </>
    );
  }
  