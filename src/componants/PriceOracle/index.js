import { ethers } from 'ethers'
import ABI from './ABI.js'
import { useEffect, useState } from 'react'

const Oracle = {
    'ETHUSD': '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
}

// Public etherereum RPC provider
const providerUrl = 'https://rpc.ankr.com/eth'

const provider = ethers.getDefaultProvider(providerUrl);

const getLatestPrice = async (pair) => {
    const contract = new ethers.Contract(Oracle[pair], ABI, provider);
    let price = await contract.latestAnswer();
    const decimals = await contract.decimals();

    price = price / 10 ** decimals;

    return price;
}

(async () => {
    let price = await getLatestPrice('ETHUSD');
    
    console.log(price.toString());
})();


const useETHPrice = () => {
    const [price, setPrice] = useState(0)

    const getPrice = async () => {
        const price = await getLatestPrice('ETHUSD');
        setPrice(price.toString())
    }

    useEffect(() => {
        getPrice()
    }, [])

    return price
}



export { useETHPrice }