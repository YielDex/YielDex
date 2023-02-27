// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./OpsReady.sol";

interface ICounter {
    function increaseCount(uint256 amount) external;

    function lastExecuted() external view returns (uint256);
}

contract CounterWT is OpsReady {
    uint256 public count;
    uint256 public lastExecuted;
    bool isPriceOkay;
    ICounter public immutable counter;

    constructor(address _ops, address _taskCreator)  OpsReady(_ops, _taskCreator) {
        counter = ICounter(address(this));
        isPriceOkay = false;
    }

    function togglePrice() public {
        isPriceOkay = !isPriceOkay;
    }

    receive() external payable {}

    function increaseCount(uint256 amount) external onlyDedicatedMsgSender {
        count += amount;
        lastExecuted = block.timestamp;

        (uint256 fee, address feeToken) = _getFeeDetails();

        _transfer(fee, feeToken);
    }

    function withdrawFunds() public {
        address payable recipient = payable(msg.sender);
        recipient.transfer(address(this).balance);
    }

    function checker() external view returns (bool canExec, bytes memory execPayload) {
        canExec = isPriceOkay; // The condition that needs to be true for the task to be executed
        execPayload = abi.encodeCall(ICounter.increaseCount, (1)); // The function that you want to call on the contract
    }

}


