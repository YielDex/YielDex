// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./yield-daddy/aave-v3/AaveV3ERC4626Factory.sol";
import "./yield-daddy/aave-v3/IPoolAddressesProvider.sol";

contract LendingVault {

    AaveV3ERC4626Factory public immutable aaveFactory;
    IPool public immutable aavePool;
    IPoolAddressesProvider public immutable aavePoolAddressesProvider;
    mapping(ERC20 => ERC4626) public erc4626s;
    //IRewardsController public immutable rewardsController;
    //address public constant rewardRecipient = address(0x01);

    constructor() {
        // Working in Goerli
        aavePoolAddressesProvider = IPoolAddressesProvider(0xC911B590248d127aD18546B186cC6B324e99F02c);
        aavePool = IPool(aavePoolAddressesProvider.getPool());
        //rewardsController = IRewardsController(aavePoolAddressesProvider.getRewardsController());
        aaveFactory = new AaveV3ERC4626Factory(aavePool); // will continue aave integration later
        //testAsset
        ERC20 usdcERC20 = ERC20(0x65aFADD39029741B3b8f0756952C74678c9cEC93);
        erc4626s[usdcERC20] = aaveFactory.createERC4626(usdcERC20);
    }

    function deposit(address tokenAddress, uint256 _amount, address _receiver) external {
        ERC20(tokenAddress).approve(address(erc4626s[ERC20(tokenAddress)]), _amount);
        erc4626s[ERC20(tokenAddress)].deposit(_amount, _receiver);
        //aaveFactory.createERC4626(address(this), _amount);
    }

    function withdraw(address tokenAddress, uint256 _amount, address _receiver) external {
        erc4626s[ERC20(tokenAddress)].withdraw(_amount, _receiver, address(this));
    }

}