// const Str = require('@supercharge/strings')
var OrderExecutor = artifacts.require("OrderExecutor.sol");

module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
    OrderExecutor = await OrderExecutor.at("0xA60ac1B18A69dEE37B9A061B3C22735526B98e6e");
    await OrderExecutor.withdraw();
    });
};

// ops
//0x08f6dDE16166F06e1d486749452dc3A44f175456

// truffle run verify OrderBook@0x27Dc7374e1C5BF954Daf6Be846598Af76A33F2a2 --network mumbai 
// truffle run verify OrderExecutor@0xaeaD98593a19074375cCf3ec22E111ce48C02c7E --network mumbai 
// truffle run verify LendingVault@0xaeaD98593a19074375cCf3ec22E111ce48C02c7E --network mumbai 
