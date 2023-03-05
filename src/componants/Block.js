import { useEffect, useState } from 'react';
import './PriceOracle'
import { useAccount } from 'wagmi'
import { prepareWriteContract, writeContract } from '@wagmi/core'

import { Assets, Contracts } from '../constants/Polygon.assets.js';

import { BigNumber } from 'ethers';
import { useETHPrice } from './PriceOracle';

const Block = ({ strategyName, image, score, cryptoLogo, buyAssetState, underlayingAssetState }) => {
  const {selectedBuyAsset, setSelectedBuyAsset} = buyAssetState;
  const {selectedUnderlayingAsset, setSelectedUnderlayingAsset} = underlayingAssetState;

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [orderPrice, setOrderPrice] = useState("");
  const { address, isConnected } = useAccount();
  const [txHash, setTxHash] = useState("");
  const [orderAmount, setOrderAmount] = useState(1);
  const decimales = Assets.filter(asset => asset.assetAddress === selectedUnderlayingAsset)[0]?.assetDecimals;

  // const mumbaiChainId = 80001;
  const polygonChainId = 137;

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

  const handleAmountChange = (event) => {
    setOrderAmount(event.target.value);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const OrderBookAddress = Contracts.filter(contract => contract.contractName === 'OrderBook')[0].contractAddress;


  const approveTransaction = async (orderAmount) => {
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
      args: [ OrderBookAddress, BigNumber.from(orderAmount).mul(BigNumber.from(10).pow(decimales)) ],
      // chainId: mumbaiChainId,
      chainId: polygonChainId,
    })
    const { hash } = await writeContract(config)
    console.log(hash)
    return hash
  }

  const runPlaceOrderTransaction = async (orderAmount) => {
    const config = await prepareWriteContract({
      address:  OrderBookAddress,
      abi: [
        {
           "inputs":[
              {
                 "internalType":"address",
                 "name":"_opsAddress",
                 "type":"address"
              }
           ],
           "stateMutability":"nonpayable",
           "type":"constructor"
        },
        {
           "anonymous":false,
           "inputs":[
              {
                 "indexed":false,
                 "internalType":"string",
                 "name":"",
                 "type":"string"
              },
              {
                 "indexed":false,
                 "internalType":"uint256",
                 "name":"",
                 "type":"uint256"
              }
           ],
           "name":"orderCreated",
           "type":"event"
        },
        {
           "inputs":[
              {
                 "internalType":"uint256",
                 "name":"_orderNonce",
                 "type":"uint256"
              }
           ],
           "name":"cancelOrder",
           "outputs":[
              
           ],
           "stateMutability":"nonpayable",
           "type":"function"
        },
        {
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
                 "name":"_tokenIn",
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
        },
        {
           "inputs":[
              
           ],
           "name":"dedicatedMsgSender",
           "outputs":[
              {
                 "internalType":"address",
                 "name":"",
                 "type":"address"
              }
           ],
           "stateMutability":"view",
           "type":"function"
        },
        {
           "inputs":[
              
           ],
           "name":"fundsOwner",
           "outputs":[
              {
                 "internalType":"address",
                 "name":"",
                 "type":"address"
              }
           ],
           "stateMutability":"view",
           "type":"function"
        },
        {
           "inputs":[
              
           ],
           "name":"getExecutorAddress",
           "outputs":[
              {
                 "internalType":"address",
                 "name":"",
                 "type":"address"
              }
           ],
           "stateMutability":"view",
           "type":"function"
        },
        {
           "inputs":[
              {
                 "internalType":"uint256",
                 "name":"_orderNonce",
                 "type":"uint256"
              }
           ],
           "name":"getOrder",
           "outputs":[
              {
                 "components":[
                    {
                       "internalType":"address",
                       "name":"user",
                       "type":"address"
                    },
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
                    },
                    {
                       "internalType":"bytes32",
                       "name":"orderId",
                       "type":"bytes32"
                    },
                    {
                       "internalType":"bool",
                       "name":"isExecuted",
                       "type":"bool"
                    }
                 ],
                 "internalType":"struct OrderDatas",
                 "name":"",
                 "type":"tuple"
              }
           ],
           "stateMutability":"view",
           "type":"function"
        },
        {
           "inputs":[
              
           ],
           "name":"ops",
           "outputs":[
              {
                 "internalType":"contract IOps",
                 "name":"",
                 "type":"address"
              }
           ],
           "stateMutability":"view",
           "type":"function"
        },
        {
           "inputs":[
              {
                 "internalType":"uint256",
                 "name":"_orderNonce",
                 "type":"uint256"
              }
           ],
           "name":"setExecuted",
           "outputs":[
              
           ],
           "stateMutability":"nonpayable",
           "type":"function"
        },
        {
           "inputs":[
              {
                 "internalType":"address",
                 "name":"_lendingVaultAddress",
                 "type":"address"
              }
           ],
           "name":"setLendingVault",
           "outputs":[
              
           ],
           "stateMutability":"nonpayable",
           "type":"function"
        },
        {
           "inputs":[
              {
                 "internalType":"contract OrderExecutor",
                 "name":"_orderExecutorAddress",
                 "type":"address"
              }
           ],
           "name":"setOrderExecutor",
           "outputs":[
              
           ],
           "stateMutability":"nonpayable",
           "type":"function"
        },
        {
           "inputs":[
              
           ],
           "name":"taskTreasury",
           "outputs":[
              {
                 "internalType":"contract ITaskTreasuryUpgradable",
                 "name":"",
                 "type":"address"
              }
           ],
           "stateMutability":"view",
           "type":"function"
        },
        {
           "inputs":[
              {
                 "internalType":"uint256",
                 "name":"_amount",
                 "type":"uint256"
              },
              {
                 "internalType":"address",
                 "name":"_token",
                 "type":"address"
              }
           ],
           "name":"withdrawFunds",
           "outputs":[
              
           ],
           "stateMutability":"nonpayable",
           "type":"function"
        }
     ],
      functionName: 'createOrder',
      args: [
        orderPrice,
        BigNumber.from(orderAmount).mul(BigNumber.from(10).pow(decimales)),
        selectedUnderlayingAsset,
        selectedBuyAsset
      ],
      // chainId: mumbaiChainId,
      chainId: polygonChainId
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
                <label>Amount: </label>
                <input
                  type="number"
                  value={orderAmount}
                  onChange={handleAmountChange}
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
