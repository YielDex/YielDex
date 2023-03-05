// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./OpsReady.sol";
import "./OrderBook.sol";
import "./uniswap/ISwapRouter.sol";

contract OrderExecutor is OpsReady {

    uint price;
    address deployer;

    OrderBook public orderBook;
    ISwapRouter public immutable swapRouter;

    event OrderDone(string, uint256);

    constructor(address _ops, address _taskCreator, address _swapRouter) OpsReady(_ops, _taskCreator) {
        price = 100; // arbitrary price
        deployer = msg.sender;
        orderBook = OrderBook(_taskCreator);
        swapRouter = ISwapRouter(_swapRouter);
    }

    // For this example, we will set the pool fee to 0.3%.
    uint24 public constant poolFee = 3000;

    function setPrice(uint _price) public {
        price = _price;
    }

    receive() external payable {}

    function executeOrder(uint orderNonce) external /*onlyDedicatedMsgSender*/ {
        // execute order with orderNonce here
        uint256 amountOut = orderBook.closeYieldStrategy(orderNonce);
        
        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: orderBook.getOrder(orderNonce).tokenIn,
                tokenOut: orderBook.getOrder(orderNonce).tokenOut,
                fee: poolFee,
                recipient: orderBook.getOrder(orderNonce).user,
                deadline: block.timestamp,
                amountIn: amountOut,
                amountOutMinimum: 0, // NOT IN PRODUCTION
                sqrtPriceLimitX96: 0 // NOT IN PRODUCTION
            });

        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
        IERC20(orderBook.getOrder(orderNonce).tokenOut).transfer(orderBook.getOrder(orderNonce).user, amountOut);

        orderBook.setExecuted(orderNonce);
        emit OrderDone("order_executed", orderNonce);
        // 
        (uint256 fee, address feeToken) = _getFeeDetails();
        // on a les fees jusqu'à là
        _transfer(fee, feeToken);
    }

    function checker(uint orderNonce) external view returns (bool canExec, bytes memory execPayload) {
        // check that liquidity is still into the vault
        // require(vault.getLiquidity() > 0, "No liquidity");
        canExec = orderBook.getOrder(orderNonce).price == price; // The condition that needs to be true for the task to be executed, you can filter the condition with the orderId
        execPayload = abi.encodeCall(OrderExecutor.executeOrder, orderNonce); // The function that you want to call on the contract
    }

    // Only used for testing
    function withdraw() public {
        require(msg.sender == deployer, "not allowed address");
        payable(msg.sender).transfer(address(this).balance);
    }

}
