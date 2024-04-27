// import { ethers } from 'ethers';
import {  useState } from 'react';
import Button from "react-bootstrap/Button";
// import { ContractAddress } from '../../constants/constants';
// import ContractAbi from "../../artifacts/contracts/hello.sol/CoinCircles.json"
import { connectUser } from '../CallContractFunctions/ContractFunctions';
// import { initContract } from '../CallContractFunctions/ContractFunctions';
import { disconnectWallet } from '../CallContractFunctions/ContractFunctions';
export default function ConnectWallet() {
  const [walletAddress,setWalletAddress] = useState(null);
  const [error, setError] = useState(null);
  
  const [provider,setProvider]=useState(null);
  // eslint-disable-next-line no-unused-vars
  const [contract,setContract]=useState(null);
  
  const [isConnected, setIsConnected] = useState(false);



 

  return (
    <>
  {walletAddress ? (
      <>
        <h3>Address: {walletAddress.substring(0, 5)}</h3>
        {isConnected ? (
          <Button onClick={()=>disconnectWallet(setWalletAddress)}>Disconnect</Button>
        ) : (
          <Button onClick={() => connectUser(setWalletAddress, setIsConnected, setContract, setProvider,setError)} >Connect</Button>
        )}
      </>
    ) : (
      <Button onClick={() => connectUser(setWalletAddress, setIsConnected, setContract, setProvider,setError)}>Connect</Button>
    )}
    {error && <p>{error}</p>}
    </>
  );
}
