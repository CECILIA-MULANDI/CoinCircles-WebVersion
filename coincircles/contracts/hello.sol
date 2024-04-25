// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract CoinCircles{
    // global variables
    uint256 chamaIds;
    // user
    struct User{
        address wallet_address;
        bool isConnected;
    }
    struct Chama{
        string name;
        string purpose;
        uint256 maxNoOfPeople;
        uint256 minDeposit;
        bool isFull;
        ChamaVisibility visibility;
    }
    // enums
    enum ChamaVisibility{
        Public,
        Private 
    }
    // mappings
    mapping (address=>User) public users;
    mapping(uint256=>Chama) public chamas;
    
    // events
    event UserConnected(address wallet_address);
    event ChamaCreated(uint256 chamaId,string name);

    // register function
    function connect_user()   public {
        // check if the email is registered
        require(!users[msg.sender].isConnected, "User is already  Connected");

        // create a new User
        User memory newUser =User({
          
            wallet_address:msg.sender,
            isConnected:true
        });
        users[msg.sender]=newUser;
        emit UserConnected(msg.sender);


    }

    // create chama function
    function create_chama(string memory _name,string memory _purpose,uint256 _maxNoPeople,uint256 _minDeposit,ChamaVisibility _visibility) public{
        // check if the user is logged in
        require(users[msg.sender].isConnected,"User is not connected");
        // check if there is a chama with the same name
        for (uint256 i =0;i<=chamaIds;i++){
           require( keccak256(bytes(chamas[i].name)) != keccak256(bytes(_name)),"A chama with this name already exists");
        }
        
        Chama memory new_chama=Chama({
            name:_name,
            purpose:_purpose,
           maxNoOfPeople:_maxNoPeople,
            minDeposit:_minDeposit,
            isFull:false,
            visibility:_visibility
        });
        chamas[chamaIds]=new_chama;
        chamaIds++;
        emit ChamaCreated(chamaIds, _name);
        
       
        

    }
}