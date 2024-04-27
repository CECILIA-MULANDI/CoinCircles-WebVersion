// import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
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

  // const [message,setMessage]=useState()
  

  // const connectWallet = async () => {
  //   if (window.ethereum) {
  //     try {
  //       // Requesting access to user accounts
  //     let accounts=  await window.ethereum.request({ method: 'eth_requestAccounts' });
  //       // Creating a provider
  //     let web3provider=new ethers.providers.Web3Provider(window.ethereum);
  //       // setProvider(provider);
       
  //       setProvider(web3provider);
  //       // call the contract
  //       const contract=new ethers.Contract(ContractAddress,ContractAbi.abi,web3provider.getSigner());
  //       setContract(contract);
  //       // check if the user is already connected
  //       const Connected= await contract.users(accounts[0]);
  //       if(Connected.isConnected){
  //         setIsConnected(true);
  //         setWalletAddress(accounts[0]);
  //       }else{
  //         // call the contract fn
  //         const tx = await contract.connect_user();
  //       await tx.wait();
  //       setWalletAddress(accounts[0]);

  //       }
  //       setError(null);
  //     } catch (err) {
  //       setError('Error connecting to wallet');
  //       console.error(err);
  //     }
  //   } else {
  //     setError('Please install MetaMask');
  //   }
  // }
  // const disconnectWallet=()=>{

  // }

  useEffect(() => {
    try{
    // initContract()
    // connectUser(setWalletAddress,setIsConnected,setContract,setProvider)

    }catch(e){
      setError('Error connecting to wallet');
    console.error(e);

    }
    // Checking if MetaMask is installed and connected on component mount
    
  }, []);

  return (
    <>
  {walletAddress ? (
      <>
        <h3>Address: {walletAddress.substring(0, 5)}</h3>
        {isConnected ? (
          <Button onClick={disconnectWallet}>Disconnect</Button>
        ) : (
          <Button onClick={() => connectUser(setWalletAddress, setIsConnected, setContract, setProvider)}>Connect</Button>
        )}
      </>
    ) : (
      <Button onClick={() => connectUser(setWalletAddress, setIsConnected, setContract, setProvider)}>Connect</Button>
    )}
    {error && <p>{error}</p>}
    </>
  );
}
