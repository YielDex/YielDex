// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./Types.sol";
import "./OrderExecutor.sol";
import "./OpsTaskCreator.sol";
import './LendingVault.sol';

struct OrderDatas {
    address user;
    uint256 price;
    uint256 amount;
    address fromToken;
    address toToken;
    bytes32 orderId;
    bool isExecuted;
}

contract OrderBook is OpsTaskCreator {
    mapping (uint => OrderDatas) public orders; // returns order data
    uint orderNonce;
    address public admin;
    OrderExecutor public orderExecutor;
    LendingVault public lendingVault;
    event construct(string, address);
    event orderCreated(string, uint256);

    constructor(address _opsAddress) OpsTaskCreator(_opsAddress, address(this)) {
        admin = msg.sender;
    }

    function setOrderExecutor(OrderExecutor _orderExecutorAddress) public {
        require(msg.sender == admin, "You are not allowed to do that");
        orderExecutor = _orderExecutorAddress;
    }

    function setLendingVault(address _lendingVaultAddress) public {
        require(msg.sender == admin, "You are not allowed to do that");
        lendingVault = LendingVault(_lendingVaultAddress);
    } 

    function createOrder(uint price, uint amount, address fromToken, address toToken) external returns (uint) {
        IERC20 FromToken = IERC20(fromToken);

        // The user needs to approve this contract for the appropriate amount
        FromToken.transferFrom(msg.sender, address(this), amount);

        bytes memory execData = abi.encodeCall(orderExecutor.executeOrder, (orderNonce));

        ModuleData memory moduleData = ModuleData({
            modules: new Module[](2),
            args: new bytes[](2)
        });

        moduleData.modules[0] = Module.RESOLVER;
        moduleData.modules[1] = Module.SINGLE_EXEC;

        moduleData.args[0] = _resolverModuleArg(address(orderExecutor), abi.encodeCall(orderExecutor.checker, (orderNonce)));
        moduleData.args[1] = _singleExecModuleArg();

        // Faulty
        bytes32 orderId = ops.createTask(
            address(orderExecutor), // contract to execute
            execData, // function to execute
            moduleData,
            0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE
        );

        orders[orderNonce] = OrderDatas(msg.sender, price, amount, fromToken, toToken, orderId, false);

        // Transfer tokens to the vault
        FromToken.transfer(address(lendingVault), amount); // approval needed to be able to swap liquidity
        lendingVault.deposit(fromToken, amount, msg.sender); // depositing liquidity into the vault
        //FromToken.transfer(address(lendingVault), amount);

        orderNonce++;

        emit orderCreated("orderNonce", orderNonce);

        return orderNonce;
    }

    function closeYieldStrategy(uint _orderNonce) public {
        lendingVault.withdraw(orders[_orderNonce].fromToken, orders[_orderNonce].amount, orders[_orderNonce].user);
    }

    function cancelOrder(uint _orderNonce) external {
        require(
            msg.sender == admin || orders[_orderNonce].user == msg.sender,
            "Not allowed to cancel this order"
        );
        ops.cancelTask(orders[_orderNonce].orderId);
    }

    // function to return executor address in order to check the txs
    function getExecutorAddress() public view returns (address) {
        return address(orderExecutor);
    }

    function setPrice(uint price) public {
        orderExecutor.setPrice(price);
    }

    
    function setExecuted(uint orderNonce) public {
        require(msg.sender == address(orderExecutor), "Only the executor can set the order as executed");
        orders[orderNonce].isExecuted = true;
    }

    function getOrder(uint orderNonce) public view returns (OrderDatas memory) {
        return orders[orderNonce];
    }

}


