// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import './IERC4626.sol';

contract LendingVault is IERC4626 {
    constructor() {
        // ...
    }

    function totalSupply() external view override returns (uint256) {}

    function balanceOf(
        address account
    ) external view override returns (uint256) {}

    function transfer(
        address recipient,
        uint256 amount
    ) external override returns (bool) {}

    function allowance(
        address owner,
        address spender
    ) external view override returns (uint256) {}

    function approve(
        address spender,
        uint256 amount
    ) external override returns (bool) {}

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external override returns (bool) {}

    function name() external view override returns (string memory) {}

    function symbol() external view override returns (string memory) {}

    function decimals() external view override returns (uint8) {}

    function asset()
        external
        view
        override
        returns (address assetTokenAddress)
    {}

    function totalAssets()
        external
        view
        override
        returns (uint256 totalManagedAssets)
    {}

    function convertToShares(
        uint256 assets
    ) external view override returns (uint256 shares) {}

    function convertToAssets(
        uint256 shares
    ) external view override returns (uint256 assets) {}

    function maxDeposit(
        address receiver
    ) external view override returns (uint256 maxAssets) {}

    function previewDeposit(
        uint256 assets
    ) external view override returns (uint256 shares) {}

    function deposit(
        uint256 assets,
        address receiver
    ) external override returns (uint256 shares) {}

    function maxMint(
        address receiver
    ) external view override returns (uint256 maxShares) {}

    function previewMint(
        uint256 shares
    ) external view override returns (uint256 assets) {}

    function mint(
        uint256 shares,
        address receiver
    ) external override returns (uint256 assets) {}

    function maxWithdraw(
        address owner
    ) external view override returns (uint256 maxAssets) {}

    function previewWithdraw(
        uint256 assets
    ) external view override returns (uint256 shares) {}

    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) external override returns (uint256 shares) {}

    function maxRedeem(
        address owner
    ) external view override returns (uint256 maxShares) {}

    function previewRedeem(
        uint256 shares
    ) external view override returns (uint256 assets) {}

    function redeem(
        uint256 shares,
        address receiver,
        address owner
    ) external override returns (uint256 assets) {}
}