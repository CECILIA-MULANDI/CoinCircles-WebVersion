// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract CoinCircles {
    // Global variables
    uint256 chamaIds;
    
    // User
    struct User {
        address wallet_address;
        bool isConnected;
    }
    
    // Chama
    struct Chama {
        string name;
        string purpose;
        uint256 maxNoOfPeople;
        uint256 minDeposit;
        bool isFull;
        ChamaVisibility visibility;
        address owner;
        // Tracks members in a private chama
        mapping(address => bool) members;
    }
    
    // Enums
    enum ChamaVisibility {
        Public,
        Private 
    }
    
    // Mappings
    mapping(address => User) public users;
    mapping(uint256 => Chama) public chamas;
    
    // Events
    event UserConnected(address wallet_address);
    event ChamaCreated(uint256 chamaId, string name);

    // Register function
    function connect_user() public {
        // Check if the user is already connected
        require(!users[msg.sender].isConnected, "User is already connected");

        // Create a new User
        User memory newUser = User({
            wallet_address: msg.sender,
            isConnected: true
        });
        users[msg.sender] = newUser;
        emit UserConnected(msg.sender);
    }

    // Create chama function
    function create_chama(string memory _name, string memory _purpose, uint256 _maxNoPeople, uint256 _minDeposit, ChamaVisibility _visibility) public {
        // Check if the user is logged in
        require(users[msg.sender].isConnected, "User is not connected");
        require(_maxNoPeople >= 2, "Chama should have at least two members");
        require(_minDeposit > 0, "The minimum deposit should be greater than zero");

        // Check if there is a chama with the same name
        for (uint256 i = 0; i <= chamaIds; i++) {
            require(keccak256(bytes(chamas[i].name)) != keccak256(bytes(_name)), "A chama with this name already exists");
        }
        
        // Create a new Chama instance
        Chama storage new_chama = chamas[chamaIds];
        new_chama.name = _name;
        new_chama.purpose = _purpose;
        new_chama.maxNoOfPeople = _maxNoPeople;
        new_chama.minDeposit = _minDeposit;
        new_chama.isFull = false;
        new_chama.owner = msg.sender;
        new_chama.visibility = _visibility;

        // Initialize members mapping for private chamas
        if (_visibility == ChamaVisibility.Private) {
            new_chama.members[msg.sender] = true; // Add the creator as a member
        }

        chamaIds++;
        emit ChamaCreated(chamaIds, _name);
    }

    // Add members function
    function add_members(uint256 _chamaId) public {
        // Check if the chama visibility is private
        require(chamas[_chamaId].visibility == ChamaVisibility.Private, "Chama visibility is not private");

        // Check if the caller is the creator of the chama
        require(msg.sender == chamas[_chamaId].owner, "Only the chama owner can add members");

        // Add the caller (msg.sender) as a member
        chamas[_chamaId].members[msg.sender] = true;
    }
}
