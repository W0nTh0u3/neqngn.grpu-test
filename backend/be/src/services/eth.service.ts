import { BigNumberish, ethers } from 'ethers';
import redisClient from '../utils/redis';
import BalanceModel from '../models/Balance';

const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);

export async function getEthInfo(address: string) {
    const CACHE_TTL = parseInt(process.env.CACHE_TTL || '30'); // ? default 30 seconds

    const [cachedGasPrice, cachedBlockNumber] = await Promise.all([
        redisClient.get('gasPrice'),
        redisClient.get('blockNumber')
    ]);

    let gasPrice: BigNumberish;
    let blockNumber: number;

    if (cachedGasPrice && cachedBlockNumber) {
        console.log('Using cached gas price and block number');
        gasPrice = BigInt(cachedGasPrice);
        blockNumber = parseInt(cachedBlockNumber, 10);
    }
    else {
        console.log('Fetching gas price and block number from provider');
        const [feeData, blockNumberRes] = await Promise.all([
            provider.getFeeData(),
            provider.getBlockNumber(),
        ]);
        gasPrice = feeData.gasPrice || BigInt(0);
        blockNumber = blockNumberRes || 0;
        await Promise.all([
            redisClient.set('gasPrice', feeData.gasPrice?.toString() || '0', { EX: CACHE_TTL }),
            redisClient.set('blockNumber', blockNumber.toString(), { EX: CACHE_TTL })
        ]);
    }

    const balance: bigint = await provider.getBalance(address);
    const balanceEth: string = ethers.formatEther(balance);

    await storeToDb(address, balanceEth);

    return {
        address,
        balance: `${balanceEth} ETH`,
        gasPrice: `${ethers.formatUnits(gasPrice, 'gwei')} gwei`,
        blockNumber,
    };
}

const storeToDb = async (address: string, balance: string) => {
    try {
        await BalanceModel.create({ address, balance });
        console.log(`Balance for ${address}: ${balance} ETH, Stored in DB`);
    } catch (err) {
        console.error(`Error storing balance for ${address} in DB:`, err);
    }
};