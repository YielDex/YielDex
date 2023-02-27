// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./OpsReady.sol";


contract OrderExecutor is OpsReady {
    bool isPriceOkay;

    constructor(address _ops, address _taskCreator) OpsReady(_ops, _taskCreator) {
        isPriceOkay = false;
    }

    function togglePrice() public {
        isPriceOkay = !isPriceOkay;
    }

    receive() external payable {}

    function executeOrder(uint orderNonce) external /*onlyDedicatedMsgSender*/ {
        // execute order with orderNonce here
        (uint256 fee, address feeToken) = _getFeeDetails();
        _transfer(fee, feeToken);
    }

    function withdrawFunds() public {
        address payable recipient = payable(msg.sender);
        recipient.transfer(address(this).balance);
    }

    function checker(uint orderNonce) external view returns (bool canExec, bytes memory execPayload) {
        canExec = isPriceOkay; // The condition that needs to be true for the task to be executed, you can filter the condition with the orderId
        execPayload = abi.encodeCall(OrderExecutor.executeOrder, (orderNonce)); // The function that you want to call on the contract
    }

}


