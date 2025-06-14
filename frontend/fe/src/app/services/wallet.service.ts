import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BrowserProvider, Signer, ethers, formatEther } from 'ethers';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { ITransaction } from '../models/transaction.model';

interface IEtherscanResponse {
  status: string;
  message: string;
  result: ITransaction[];
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private readonly provider?: BrowserProvider;
  private signer?: Signer;
  readonly hasEthereumProvider: boolean = !!(<any>window).ethereum;

  constructor(
    private readonly http: HttpClient
  ) {
    const provider = this.getEthereumProvider();
    if (this.hasEthereumProvider) {
      this.provider = new BrowserProvider(provider);
    }
    else {
      console.warn('No Ethereum provider found. Please install MetaMask or another wallet extension.');
    }
  }

  private getEthereumProvider() {
    const ethereum = (<any>window).ethereum;
    if (!ethereum) return undefined;
    if (ethereum.isMetaMask) return ethereum;
    return ethereum;
  }

  async connectToWallet(): Promise<string | undefined> {
    try {
      console.log('Requesting account access...');
      const res = await this.provider?.send('eth_requestAccounts', []);
      console.log('Connected accounts:', res);
      this.signer = await this.provider?.getSigner();
      return await this.signer?.getAddress();
    }
    catch (error) {
      console.error('Error connecting to wallet:', error);
      throw error;
    }
  }

  async getBalance(address: string): Promise<string | undefined> {
    const balance = await this.provider?.getBalance(address);
    return balance ? formatEther(balance) : '0';
  }

  async getTransactions(address: string, limit: number = 10): Promise<ITransaction[]> {
    const addressTest = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'; // ? Example address
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${environment.etherscanApiKey}`;
    const response: IEtherscanResponse = await lastValueFrom(this.http.get<IEtherscanResponse>(url));
    console.log('Etherscan response:', response);
    if (response.status !== '1' || response.result.length === 0) {
      console.error('Error fetching transactions:', response.message);
      return [];
    }
    return response.result.map((tx: ITransaction) => ({ ...tx, value: ethers.formatEther(tx.value) }));
  }
}
