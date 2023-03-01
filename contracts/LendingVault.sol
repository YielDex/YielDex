// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract LendingVault {
    mapping (address => uint) name;

    constructor(address _owner, address _counter) {
    }

    function increaseCount() external {
        require(msg.sender == owner, "Only owner can increase count");
        (bool success, ) = counter.call(abi.encodeWithSignature("increaseCount()"));
        require(success, "Increase count failed");
    }
}