import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { ethers } from 'ethers';
import { ContractAddress } from '../../constants/constants';
import contractAbi from "../../artifacts/contracts/hello.sol/CoinCircles.json";

export default function ConnectWallet() {
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [contract, setContract] = useState(null);
  
    useEffect(() => {
      const connectToContract = async () => {
        if (window.ethereum) {
          try {

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
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
          if (window.ethereum) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const userAddress = await signer.getAddress();
            accountChanged(userAddress);
            if (contract) {
              // Call your contract's connect_user function
              const transaction = await contract.connect_user();
              await transaction.wait(); // Wait for transaction to be mined
              // Update user's address after transaction is confirmed
              const updatedUserAddress = await signer.getAddress();
              accountChanged(updatedUserAddress);
            } else {
              setErrorMessage('Contract not loaded');
            }
          } else {
            setErrorMessage('Kindly install MetaMask');
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
          {defaultAddress ? (
            <h3>Address: {defaultAddress.substring(0, 10)}...</h3>
          ) : (
            <>
              <Button onClick={connectWallet}>Connect Wallet</Button>
              {errorMessage && <p>{errorMessage}</p>}
            </>
          )}
        </>
      );
    }          