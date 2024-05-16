// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract CoinCircles{
    // global variables
    uint256 chamaIds;
    // State variable to keep track of the index of the last member who received funds
    uint256 lastDistributedMemberIndex = 0;
    // create user
    struct User{
        address wallet_address;
        bool isConnected;

    }
    struct Profile{
        address users_wallet_address;
        mapping(string=>uint256) contributionsMade;
       

    }

    // create  a chama
    struct Chama{
        string name;
        uint256 maxNoOfPeople;
        bool isFull;
        ChamaVisibility visibility;
        mapping (address=>bool) members;
        address[] listOfMembers;
        address owner;
        uint256 targetAmountPerRound;
        uint256 totalContribution;
        uint256 numberOfRounds;
        uint256 minimumNoOfPeople;
        address [] hasContributed;
        mapping(address => mapping(uint256 => uint256)) contributionsPerRound;
        bool hasContributionStarted;
        uint256 currentRound;

       
        
    }
    enum ChamaVisibility{
        Public,
        Private
    }
    mapping (address => User) public users;
    mapping (uint256=>Chama) public chamas;
    mapping(address => mapping(uint256 => bool)) public hasContributed;
    mapping(address => mapping(uint256 => bool)) public fundsReceived;
    // events
    event UserConnected(address wallet_address);
    event ChamaCreated(uint256 chamaIds,string name);
    event UserJoinedChama(string name,address user_address);
    event MemberAddedToPrivateChama(string chamaName, address newMember);
    event ContributionMade(string name, address user_address,uint256 amount);
    event FundsDistributed(string chamaName, address recipient, uint256 amount);
    event FundsReceived(string chamaName, address recipient, uint256 amountReceived);



    // function to connect user
    function connect_user() public{
        // check if the user is connected
        require(!users[msg.sender].isConnected,"User is already connected");
            // create a new user
        User memory new_user = User({
                wallet_address:msg.sender,
                isConnected:true
            });
            // add user
        users[msg.sender]=new_user;
        //    emit events
        emit UserConnected(msg.sender);
     }

    //  fn to create a chama

    function create_chama(string memory _name, uint256 _maxNoOfPeople,ChamaVisibility _visibility,uint256 _minimumNoOfPeople,uint256 _targetAmountPerRound) public {
        // checks
        require(users[msg.sender].isConnected,"User is not connected");
        require (_maxNoOfPeople>=2,"Chama should have at least two members");
        
        // require(_minDeposit>0,"The minimum deposit should be greater than zero");
        require(bytes(_name).length>0,"The length of the name should not be empty");
       
       for (uint256 i=0;i<chamaIds;i++){
        require(keccak256(bytes(chamas[i].name))!=keccak256(bytes(_name)),"A chama with this name already exists");
       }
        // create an instance of a chama
        Chama storage new_chama=chamas[chamaIds];
        new_chama.name=_name;
       
        new_chama.maxNoOfPeople=_maxNoOfPeople;
        // new_chama.minDeposit=_targetAmountPerRound/new_chama.;
        new_chama.isFull=false;
        new_chama.visibility=_visibility;
        new_chama.owner=msg.sender;
        chamaIds++;
        new_chama.members[msg.sender] = true;
        new_chama.listOfMembers.push(msg.sender);
        new_chama.targetAmountPerRound=_targetAmountPerRound;
        new_chama.totalContribution=0;
        new_chama.minimumNoOfPeople=_minimumNoOfPeople;
        new_chama.hasContributionStarted=false;
        new_chama.numberOfRounds = new_chama.listOfMembers.length; 
        
        new_chama.currentRound=0;
        
    // Emit event or perform any other necessary action
      
        emit ChamaCreated(chamaIds,_name);

    }
    function join_chama(string memory _name) public {
         uint256 chamaId = getChamaId(_name); // Get the ID of the chama
        // check for connection
        require(users[msg.sender].isConnected, "User is not connected");
        require(chamaExists(_name), "Chama does not exist");
        require(!isMember(_name,msg.sender),"You cannot join a chama twice");
        require(!checkChamaIsFull(chamaId), "Chama is full"); // Check if chama is not full
        require(chamas[chamaId].visibility != ChamaVisibility.Private, "Private Chamas cannot be joined directly");
        require(!chamas[chamaId].hasContributionStarted, "Contributions have already started, no new members can be added");
        // require(!chamas[chamaId].hasContributionStarted, "Contributions have already started, no new members can be added");

        
        // Add user to the chama
        chamas[chamaId].members[msg.sender] = true;
        chamas[chamaId].listOfMembers.push(msg.sender);
        chamas[chamaId].numberOfRounds = chamas[chamaId].listOfMembers.length; // Update the number of rounds

      

        // Emit event or perform any other necessary action
        emit UserJoinedChama(_name, msg.sender);
    }

    function add_members_to_privatechama(string memory _name, address new_member) public {
        require(chamaExists(_name), "Chama does not exist");
        uint256 chamaId = getChamaId(_name); // Get the ID of the chama
        require(chamas[chamaId].visibility == ChamaVisibility.Private, "Only private Chamas can have members added");
        require(chamas[chamaId].owner == msg.sender, "Only the owner can add members to this private Chama");
        require(!chamas[chamaId].members[new_member], "User is already a member of this chama");
         require(!chamas[chamaId].hasContributionStarted, "Contributions have already started, no new members can be added");

        // Add user to the chama
        chamas[chamaId].members[new_member] = true;
        chamas[chamaId].listOfMembers.push(new_member); 
       

        // Emit event or perform any other necessary act
        
        emit MemberAddedToPrivateChama(_name, new_member);
    }
    


    function contributeFunds(string memory _name, uint256 _userContribution) public payable {
        require(users[msg.sender].isConnected, "User must be connected");
        require(chamaExists(_name), "Chama does not exist");
        uint256 chamaId = getChamaId(_name);
        require(isMember(_name, msg.sender), "User is not a member of this chama");
        require(chamas[chamaId].listOfMembers.length >= chamas[chamaId].minimumNoOfPeople, "The minimum number of people required to start contribution has not been reached");
        require(!hasContributed[msg.sender][chamas[chamaId].currentRound], "You have already contributed in the current round");

        // Set the current round to start at 1 when contributions start
        if (!chamas[chamaId].hasContributionStarted) {
            chamas[chamaId].currentRound = 1;
            chamas[chamaId].hasContributionStarted = true;
        }

        // Calculate how much each user should give
        uint256 userContribution = chamas[chamaId].targetAmountPerRound / chamas[chamaId].listOfMembers.length;
        require(_userContribution > 0 && _userContribution == userContribution, "Enter a valid number or a number that equals your correct contribution");

        // Track contributions per round for each member
        chamas[chamaId].contributionsPerRound[msg.sender][chamas[chamaId].currentRound] += _userContribution;
        chamas[chamaId].totalContribution += _userContribution;
        chamas[chamaId].hasContributed.push(msg.sender);
        chamas[chamaId].hasContributionStarted = true;

        // Mark member as contributed in the current round
        hasContributed[msg.sender][chamas[chamaId].currentRound] = true;

        emit ContributionMade(_name, msg.sender, _userContribution);

        if (allMembersContributedInCurrentRound(_name)) {
            // Perform distribution of funds
            distributeFunds(_name);
            // Increment the current round
            chamas[chamaId].currentRound++;
            // Reset contributions for the next round
            resetContributionsForCurrentRound(_name);
            chamas[chamaId].hasContributed = new address[](0); // Clear the hasContributed array
        } else {
            // Add the contributor to the hasContributed array
            chamas[chamaId].hasContributed.push(msg.sender);
        }
    }

   function distributeFunds(string memory _name) private {
    uint256 chamaId = getChamaId(_name);
    uint256 totalFunds = address(this).balance;
    uint256 distributionAmount = totalFunds / chamas[chamaId].listOfMembers.length;

    // Distribute funds to the next member in the rotation
    address payable nextMember = payable(chamas[chamaId].listOfMembers[lastDistributedMemberIndex]);
    nextMember.transfer(distributionAmount);
    emit FundsDistributed(_name, nextMember, distributionAmount);
    emit FundsReceived(_name, nextMember, distributionAmount); // Emit event to log funds received by the member

    // Update the state to mark the member as having received funds
    fundsReceived[nextMember][chamas[chamaId].currentRound] = true;

    // Update the index of the last member who received funds
    lastDistributedMemberIndex++;

    // Reset index if it exceeds the number of members
    if (lastDistributedMemberIndex >= chamas[chamaId].listOfMembers.length) {
        lastDistributedMemberIndex = 0;
    }
}



    function chamaExists(string memory _name) internal view returns (bool) {
        for (uint256 i = 0; i < chamaIds; i++) {
            if (keccak256(abi.encodePacked(chamas[i].name)) == keccak256(abi.encodePacked(_name))) {
                return true;
            }
        }
        return false; // If the loop completes without finding a match, return false
        }

    // check if chama is full
   function checkChamaIsFull(uint256 _chamaId) internal view returns (bool) {
        if (chamas[_chamaId].listOfMembers.length == chamas[_chamaId].maxNoOfPeople) {
            return true;
        }
        return false;
        }
    function getChamaId(string memory _name) internal view returns (uint256) {
        for (uint256 i = 0; i < chamaIds; i++) {
            if (keccak256(bytes(chamas[i].name)) == keccak256(bytes(_name))) {
                return i;
            }
        }
         return type(uint256).max; 
    }
    function getChamaMembers(string memory _name) public view returns (address[] memory) {
        require(chamaExists(_name), "Chama does not exist");
        uint256 chamaId = getChamaId(_name); // Get the ID of the chama
        return chamas[chamaId].listOfMembers;
    }
    function isMember(string memory _name,address user_address) internal view returns(bool){
        uint256 chamaId = getChamaId(_name);
        for (uint256 i =0; i<chamas[chamaId].listOfMembers.length;i++){
            if(chamas[chamaId].listOfMembers[i]==user_address){
                return true;
            }
        }
        return false;
    }

  function getCurrentContributionRound(string memory _chamaName) public view returns (uint256) {
        uint256 chamaId = getChamaId(_chamaName);
        require(chamaExists(_chamaName), "Chama does not exist");
        return chamas[chamaId].currentRound;
    }


    function allMembersContributedInCurrentRound(string memory _name) private view returns (bool) {
        uint256 chamaId = getChamaId(_name);
        uint256 contributedCount = chamas[chamaId].hasContributed.length;
        return contributedCount == chamas[chamaId].listOfMembers.length;
    }
     function resetContributionsForCurrentRound(string memory _name) private {
        uint256 chamaId = getChamaId(_name);
        for (uint256 i = 0; i < chamas[chamaId].listOfMembers.length; i++) {
            address member = chamas[chamaId].listOfMembers[i];
            hasContributed[member][chamas[chamaId].currentRound] = false;
        }
    }








    
}