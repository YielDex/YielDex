// const Str = require('@supercharge/strings')
const BigNumber = require('bignumber.js');

const dotenv = require('dotenv');
const env = dotenv.config();

var OrderBook = artifacts.require("OrderBook.sol");
var LendingVault = artifacts.require("LendingVault.sol");
var OrderExecutor = artifacts.require("OrderExecutor.sol");
var IERC20 = artifacts.require("IERC20.sol");

module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
    // Deploying orderbook contract
    console.log("process", env.parsed);
    OrderBook = await OrderBook.new(env.parsed.Ops);
    OrderExecutor = await OrderExecutor.new(env.parsed.Ops, OrderBook.address, env.parsed.SwapRouter);
    await OrderBook.setOrderExecutor(OrderExecutor.address);
		LendingVault = await LendingVault.new(env.parsed.IPoolAddressesProvider, env.parsed.USDC, OrderBook.address);
    await OrderBook.setLendingVault(LendingVault.address);
    await OrderExecutor.setLendingVault(LendingVault.address);

    console.log("OrderBook address: " + OrderBook.address);
    console.log("OrderExecutor address: " + OrderExecutor.address);
    console.log("LendingVault address: " + LendingVault.address);

    await OrderExecutor.send("100000000000000000");
    
    });
};

// ops
//0x08f6dDE16166F06e1d486749452dc3A44f175456

// truffle run verify OrderBook@0x27Dc7374e1C5BF954Daf6Be846598Af76A33F2a2 --network mumbai 
// truffle run verify OrderExecutor@0xaeaD98593a19074375cCf3ec22E111ce48C02c7E --network mumbai 
// truffle run verify LendingVault@0xaeaD98593a19074375cCf3ec22E111ce48C02c7E --network mumbai 
