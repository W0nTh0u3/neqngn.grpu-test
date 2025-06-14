import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { WalletService } from '../../services/wallet.service';
import { ITransaction } from '../../models/transaction.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wallet',
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatListModule, MatProgressSpinnerModule],
  templateUrl: './wallet.html',
  styleUrl: './wallet.scss'
})
export class Wallet {
  readonly hasEthereumProvider: boolean;
  address?: string;
  balance?: string;
  transactions?: ITransaction[];
  error: string = '';
  isLoading = signal(false);
  constructor(
    private readonly walletService: WalletService
  ) {
    this.hasEthereumProvider = walletService.hasEthereumProvider;
  }
  // Example method to handle button click

  async connectWallet() {
    try {
      this.isLoading.set(true);
      this.address = await this.walletService.connectToWallet();
      console.log('Connected address:', this.address);
      this.balance = this.address && await this.walletService.getBalance(this.address);
      console.log('Balance:', this.balance);
      if (!this.address) {
        return;
      };
      this.transactions = await this.walletService.getTransactions(this.address);
    } catch (err: any) {
      console.error('error?', err);
      this.error = 'Failed to connect or fetch data. Check console.';
    } finally {
      this.isLoading.set(false);
      console.log('Loading state:', this.isLoading());
    }
  }
}
