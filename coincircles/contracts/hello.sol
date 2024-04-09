// SPDX-License-Identifier: MIT 
pragma solidity  0.8.24;

contract Hello{
    event SayHello(address indexed sender);
    function Greeting() public{
        emit SayHello(msg.sender);

    }
}