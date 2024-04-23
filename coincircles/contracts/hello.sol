// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract CoinCircles{
    // user
    struct User{
        // string email_address;
        address wallet_address;
        bool isRegistered;
    }
    // mappings
    mapping (address=>User) public users;

    // events
    event UserRegistered(address wallet_address);

    // register function
    function register_user(string memory email_address)   public {
        // check if the email is registered
        require(!users[msg.sender].isRegistered, "User is already  registered");

        // create a new User
        User memory newUser =User({
          
            wallet_address:msg.sender,
            isRegistered:true
        });
        users[msg.sender]=newUser;
        emit UserRegistered(msg.sender);


    }
}