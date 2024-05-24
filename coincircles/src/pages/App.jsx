
// import   {ethers} from "ethers";
// we need the abi
// import Hello from "./artifacts/contracts/hello.sol/CoinCircles.json";

import CreateChama from "../components/CreateChama/CreateChama";
import NavBar from "../components/NavBar";
import Home from "../pages/Home/Home"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./css/App.css"
// contract address
// const ContractAddress = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707';
function App() {
    return ( 
        < div className = "App" >
           < NavBar/>
           {/* <CreateChama/> */}

           <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}>
          
        </Route>
      </Routes>
    </BrowserRouter>
        </div>
    );
}

export default App;