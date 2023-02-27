// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./Types.sol";
import "./CounterWT.sol";
import "./OpsTaskCreator.sol";

contract OrderBook is OpsTaskCreator {
    mapping (bytes32 => address) public userOrders; // returns array of orderIds/tasksIds
    //IOps public immutable ops; // Gelato Automate proxy

    address public admin;
    CounterWT public counter;

    constructor() OpsTaskCreator(0xc1C6805B857Bef1f412519C4A842522431aFed39, address(this)) {
        admin = msg.sender;
        counter = new CounterWT(address(ops), 0x08f6dDE16166F06e1d486749452dc3A44f175456);
    }

    function createOrder() external returns (bytes32) {
        bytes memory execData = abi.encodeCall(counter.increaseCount, (1));

        ModuleData memory moduleData = ModuleData({
            modules: new Module[](2),
            args: new bytes[](2)
        });
        moduleData.modules[0] = Module.RESOLVER;
        moduleData.modules[1] = Module.SINGLE_EXEC;

        moduleData.args[0] = _resolverModuleArg(address(counter), abi.encodeCall(counter.checker, ()));
        moduleData.args[1] = _singleExecModuleArg();

        bytes32 orderId = ops.createTask(
            address(counter), // contract to execute
            execData, // function to execute
            moduleData,
            address(0)
        );

        userOrders[orderId] = msg.sender;

        return orderId;
    }

    function cancelOrder(bytes32 _orderId) external {
        require(
            msg.sender == admin || userOrders[_orderId] == msg.sender,
            "Not allowed to cancel this order"
        );
        ops.cancelTask(_orderId);
    }

    // function to return counter address in order to check the txs
    function getCounterAddress() public view returns (address) {
        return address(counter);
    }

    function toggleCounter() public {
        counter.togglePrice();
    }

}


