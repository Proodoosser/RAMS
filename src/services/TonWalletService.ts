import { TonClient, Address, toNano, fromNano } from 'ton';
import { getHttpEndpoint } from '@orbs-network/ton-access';

class TonWalletService {
  private client: TonClient | null = null;
  private walletAddress: Address | null = null;

  async initialize() {
    try {
      const endpoint = await getHttpEndpoint({ network: 'testnet' });
      this.client = new TonClient({ endpoint });
      console.log('TON client initialized');
    } catch (error) {
      console.error('Failed to initialize TON client:', error);
    }
  }

  async connectWallet(address: string): Promise<boolean> {
    try {
      this.walletAddress = Address.parse(address);
      return true;
    } catch (error) {
      console.error('Invalid wallet address:', error);
      return false;
    }
  }

  async getBalance(): Promise<number> {
    if (!this.client || !this.walletAddress) {
      return 0;
    }

    try {
      const balance = await this.client.getBalance(this.walletAddress);
      return parseFloat(fromNano(balance));
    } catch (error) {
      console.error('Failed to get balance:', error);
      return 0;
    }
  }

  async deposit(amount: number): Promise<boolean> {
    // В реальном приложении здесь должна быть логика депозита
    // Через смарт-контракт игры
    console.log(`Depositing ${amount} TON`);
    
    // Заглушка для демо
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 2000);
    });
  }

  async withdraw(amount: number): Promise<boolean> {
    // В реальном приложении здесь должна быть логика вывода
    // Через смарт-контракт игры
    console.log(`Withdrawing ${amount} TON`);
    
    // Заглушка для демо
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 2000);
    });
  }

  disconnectWallet() {
    this.walletAddress = null;
  }

  getWalletAddress(): string | null {
    return this.walletAddress?.toString() || null;
  }

  isConnected(): boolean {
    return this.walletAddress !== null;
  }
}

export default new TonWalletService();
