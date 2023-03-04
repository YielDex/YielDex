// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./yield-daddy/aave-v3/AaveV3ERC4626Factory.sol";
import "./yield-daddy/aave-v3/IPoolAddressesProvider.sol";
import "./OrderBook.sol";

contract LendingVault {

    AaveV3ERC4626Factory public immutable aaveFactory;
    IPool public immutable aavePool;
    IPoolAddressesProvider public immutable aavePoolAddressesProvider;
    address public immutable orderBookAddress;
    mapping(ERC20 => ERC4626) public erc4626s;
    mapping(uint256 => uint256) public orderShares;
    event Shares(uint256 shares);
    //IRewardsController public immutable rewardsController;
    //address public constant rewardRecipient = address(0x01);

    constructor(address _iPoolAddressesProviderAddress, address _temporaryTokenAddress, address _orderBookAddress) {
        orderBookAddress = _orderBookAddress;
        aavePoolAddressesProvider = IPoolAddressesProvider(_iPoolAddressesProviderAddress);
        aavePool = IPool(aavePoolAddressesProvider.getPool());
        //rewardsController = IRewardsController(aavePoolAddressesProvider.getRewardsController());
        aaveFactory = new AaveV3ERC4626Factory(aavePool); // will continue aave integration later
        //testAsset
        ERC20 usdcERC20 = ERC20(_temporaryTokenAddress);
        erc4626s[usdcERC20] = aaveFactory.createERC4626(usdcERC20);
    }

    function deposit(address tokenAddress, uint256 _amount, uint256 orderNonce) external {
        ERC20(tokenAddress).approve(address(erc4626s[ERC20(tokenAddress)]), _amount);
        orderShares[orderNonce] = erc4626s[ERC20(tokenAddress)].deposit(_amount, address(this));
    }

    function withdraw(address tokenAddress, uint256 orderNonce) external {
        erc4626s[ERC20(tokenAddress)].approve(address(erc4626s[ERC20(tokenAddress)]), orderShares[orderNonce]);
        uint256 amount = erc4626s[ERC20(tokenAddress)].redeem(orderShares[orderNonce], address(this), address(this));
        ERC20(tokenAddress).transfer(OrderBook(orderBookAddress).getOrder(orderNonce).user , amount);
    }

}