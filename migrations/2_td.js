// const Str = require('@supercharge/strings')
const BigNumber = require('bignumber.js');

const dotenv = require('dotenv');
const env = dotenv.config();

var OrderBook = artifacts.require("OrderBook.sol");
var LendingVault = artifacts.require("LendingVault.sol");
var OrderExecutor = artifacts.require("OrderExecutor.sol");

module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
    // Deploying orderbook contract
    console.log("process", env.parsed)
    OrderBook = await OrderBook.new(env.parsed.Ops);
    OrderExecutor = await OrderExecutor.new(env.parsed.Ops, env.parsed.Me)
    await OrderBook.setOrderExecutor(OrderExecutor.address);
		LendingVault = await LendingVault.new(env.parsed.IPoolAddressesProvider, env.parsed.USDC);
    await OrderBook.setLendingVault(LendingVault.address);

    console.log("OrderBook address: " + OrderBook.address);
    console.log("OrderExecutor address: " + OrderExecutor.address);
    console.log("LendingVault address: " + LendingVault.address);
    });
};

// ops
//0x08f6dDE16166F06e1d486749452dc3A44f175456 tc

// truffle run verify OrderBook@0x27Dc7374e1C5BF954Daf6Be846598Af76A33F2a2 --network goerli 
// truffle run verify OrderExecutor@0xaeaD98593a19074375cCf3ec22E111ce48C02c7E --network goerli 
// truffle run verify LendingVault@0xaeaD98593a19074375cCf3ec22E111ce48C02c7E --network goerli 
