// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./yield-daddy/aave-v3/AaveV3ERC4626Factory.sol";
import "./yield-daddy/aave-v3/IPoolAddressesProvider.sol";

contract LendingVault {

    AaveV3ERC4626Factory public immutable aaveFactory;
    IPool public immutable aavePool;
    IPoolAddressesProvider public immutable aavePoolAddressesProvider;
    //IRewardsController public immutable rewardsController;
    //address public constant rewardRecipient = address(0x01);

    constructor() {
        // Working in Goerli
        aavePoolAddressesProvider = IPoolAddressesProvider(0xC911B590248d127aD18546B186cC6B324e99F02c);
        aavePool = IPool(aavePoolAddressesProvider.getPool());
        //rewardsController = IRewardsController(aavePoolAddressesProvider.getRewardsController());
        aaveFactory = new AaveV3ERC4626Factory(aavePool); // will continue aave integration later
    }

    function deposit(uint256 _amount) external {
        //aaveFactory.createERC4626(address(this), _amount);
    }

}