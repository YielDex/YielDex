import { useEffect, useState } from 'react';
import './PriceOracle'
import { useAccount, useWaitForTransaction } from 'wagmi'
import { prepareWriteContract, writeContract } from '@wagmi/core'

import { Assets, Contracts } from '../constants/Mumbai.assets';

import { BigNumber } from 'ethers';
import { useETHPrice } from './PriceOracle';

const Block = ({ strategyName, image, score, cryptoLogo, buyAssetState, underlayingAssetState }) => {
  const {selectedBuyAsset, setSelectedBuyAsset} = buyAssetState;
  const {selectedUnderlayingAsset, setSelectedUnderlayingAsset} = underlayingAssetState;

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [orderPrice, setOrderPrice] = useState("");
  const { address, isConnected } = useAccount();
  const [txHash, setTxHash] = useState("");
  const [orderAmount, setOrderAmount] = useState(10000);

  const mumbaiChainId = 80001;

  const assetUnderlaying = Assets.filter(asset => asset.assetAddress === selectedUnderlayingAsset)[0]?.assetName;
  const assetToBuy = Assets.filter(asset => asset.assetAddress === selectedBuyAsset)[0]?.assetName;

  const ethPrice = useETHPrice();
  const price = ((assetToBuy == 'ETH') && (assetUnderlaying == 'DAI' || assetUnderlaying == 'USDC')) ?  `Current price: ${Math.floor(ethPrice)}` : '';

  const handleAssetChange = (event) => {
    setSelectedBuyAsset(event.target.value);
  };

  const handlePriceChange = (event) => {
    setOrderPrice(event.target.value);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };


  const { isError, isLoading } = useWaitForTransaction({
    confirmations: 5,
    chainId: mumbaiChainId,
    hash: txHash,
  })


  const approveTransaction = async (orderAmount) => {
    console.log({address})
    const config = await prepareWriteContract({
      address: selectedUnderlayingAsset,
      abi: [{
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },],
      functionName: 'approve',
      args: [ address, orderAmount ],
      chainId: mumbaiChainId,
    })
    const { hash } = await writeContract(config)
    console.log(hash)
    return hash
  }

  const runPlaceOrderTransaction = async (orderAmount) => {
    console.log(Contracts.filter(contract => contract.contractName === 'OrderBook')[0].contractAddress)
    const config = await prepareWriteContract({
      address: Contracts.filter(contract => contract.contractName === 'OrderBook')[0].contractAddress,
      abi: [{
        "inputs":[
          {
            "internalType":"uint256",
            "name":"price",
            "type":"uint256"
          },
          {
            "internalType":"uint256",
            "name":"amount",
            "type":"uint256"
          },
          {
            "internalType":"address",
            "name":"tokenIn",
            "type":"address"
          },
          {
            "internalType":"address",
            "name":"tokenOut",
            "type":"address"
          }
        ],
        "name":"createOrder",
        "outputs":[
          {
            "internalType":"uint256",
            "name":"",
            "type":"uint256"
          }
        ],
        "stateMutability":"nonpayable",
        "type":"function"
      }],
      functionName: 'createOrder',
      args: [orderPrice, BigNumber.from(orderAmount), selectedUnderlayingAsset, selectedBuyAsset ],
      chainId: mumbaiChainId,
    })
    const { hash } = await writeContract(config)
    console.log(hash)
    return hash
  }

  const handleApproveButton = () => {
    if(isConnected) {
      (async () => {
        const approveHash = await approveTransaction(orderAmount)
      })()
    }
    else{
      alert("Please connect your wallet")
    }
  }

  const handleCreateOrderButton = () => {
    if(isConnected) {
      (async () => {
        const createOrderHash = await runPlaceOrderTransaction(orderAmount)
      })()
    }
    else{
      alert("Please connect your wallet")
    }
  }

  return (
    <>
      <div className="block" onClick={handleModalOpen}>
        <div className="image-wrapper">
          <img className="image" src={image} alt={strategyName} />
        </div>
        <h2 className="strategyName">
          {strategyName}
          <img className="logo" src={cryptoLogo} />
        </h2>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{strategyName}</h2>
              <button className="close-btn" onClick={handleModalClose}>
                X
              </button>
            </div>
            <div className="modal-body">
            <div className="modal-form">
                <label>Asset to buy:</label>
                <select value={selectedBuyAsset} onChange={handleAssetChange}>
                  <option value="">--Please choose an asset--</option>
                  {Assets.map((asset) => {
                    return <option key={asset.assetAddress} value={asset.assetAddress}>{asset.assetName}</option>;
                  }
                  )}
                </select>
                <label>Order price: </label>
                <input
                  type="number"
                  value={orderPrice}
                  onChange={handlePriceChange}
                />
                <button className="modal-btn btn btn-primary" onClick={handleApproveButton} >
                  Approve 
                </button>
                <button className="modal-btn btn btn-primary" onClick={handleCreateOrderButton}>
                  Place Order
                </button>
            </div>
            <div className="modal-right">
              <p>{price}</p>
            </div>
            {selectedBuyAsset && orderPrice && (
                <p className="modal-strategyName">
                    Your order will get yield on {strategyName} waitting {
                    Assets.find((asset) => asset.assetAddress === selectedBuyAsset).assetName
                    } price go down to {orderPrice} 
                    <img className="modal-logo" src={cryptoLogo} />
                </p>)
            }
              
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Block;
