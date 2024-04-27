
import ContractAbi from "../../artifacts/contracts/hello.sol/CoinCircles.json"
import { ContractAddress } from "../../constants/constants"
import { ethers } from "ethers"
// import ConnectWallet from "../ConnectWallet/ConnectWallet"
// let provider;
// let  contractInstance;
// export const  initContract=()=>{
//     if(window.ethereum){
//         provider=new ethers.providers.Web3Provider(window.ethereum);
//         contractInstance=new ethers.Contract(ContractAddress,ContractAbi.abi, provider.getSigner());

//     }else{
//         throw new Error('Please install Metamask')
//     }
// }
export const connectUser=async(setWalletAddress,setIsConnected,setContract,setProvider)=>{
    
    if(window.ethereum){
        try{
            let accounts=await window.ethereum.request({method:'eth_requestAccounts'});
            let web3provider=  new ethers.providers.Web3Provider(window.ethereum);
        
            setProvider(web3provider);
            const contract= await new ethers.Contract(ContractAddress,ContractAbi.abi,web3provider.getSigner(accounts[0]));
            setContract(contract);
            // const isConnected=await contractInstance.users(accounts[0]);
            // CHECK IF USER IS CONNECTED **
            const connected=await contract.users(accounts[0]);
            console.log(connected)
            if(connected.isConnected){
                setIsConnected(true)
                setWalletAddress(accounts[0]);
             
    
            }else{
                const tx = await contract.connect_user();
                await tx.wait();
                setWalletAddress(accounts[0]);
                setIsConnected(true);
        
            }
            
            // setError(null);

        }catch(err){
            // throw new Error('Error Connecting to wallet')
            // setError('Error connecting to wallet');
            // console.error(err);
            console.log(err)

        }
        }
    else{
        console.log('Please install Metamask')
    }

}
export const disconnectWallet=()=>{
    console.log("disconnected")
}

export const CreateChamas=async()=>{
 
   

}
