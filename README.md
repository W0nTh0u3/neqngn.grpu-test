# Full Stack ETH Project

---

## 📁 Project Structure

```
/frontend     - Angular project to connect wallet and show balance & tx history  
/backend      - Node.js (Express + TypeScript) REST API with Redis & MongoDB
/contracts    - Hardhat-based ERC-20 contract deployment script (with interaction test script)
```

---

## ✅ T1: Frontend (Angular + Ethers.js)

### Features:
- Connect Ethereum wallet using MetaMask.
- Display ETH balance of the connected address.
- Show the last 10 transactions using Etherscan API.
- Written in **TypeScript** using **Angular**.

### How to Run Frontend:

```bash
cd frontend\fe
npm install
ng serve
```

> ⚠️ Requires MetaMask browser extension installed.

---

## ✅ T2: Backend (Node.js + Express + Redis + MongoDB)

### Features:
- Accepts an Ethereum address and returns:
  - Current block number (cached)
  - Current gas price (cached)
  - ETH balance (from live query)
- Implemented **Redis** for gas price and block number caching.
- Stores balances in **MongoDB**.

### How to Run Backend:

1. Make sure Redis and MongoDB are running.
2. Configure `.env`:

```env
PORT=3000
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/<api-key>
REDIS_URL=redis://localhost:6379
CACHE_TTL=30
MONGO_URI=mongodb://localhost:27017/eth-api
```

3. Start backend server:

```bash
npm install
npm run dev
```

### Example Request:

```http
GET /api/eth/:address
```

---

## ✅ T3: Smart Contract (Solidity + Hardhat + Sepolia)

### Features:
- ERC-20 token with:
  - Minting (onlyOwner)
  - Transfers between addresses
  - Burn functionality
- Built using **OpenZeppelin**.
- Deployed to **Sepolia testnet**.

### How to Use:

1. Install dependencies:

```bash
cd contracts\contract
npm install
```

2. Configure `.env`:

```env
PRIVATE_KEY=<your-wallet-private-key>
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/<your-project-id>
# Optional (needed for updating contract or running the interact)
DEPLOYED_CONTRACT_ADDRESS=<token-address> 
```

3. Deploy the contract:

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

4. (Optional) Interact with the contract:

```bash
npx hardhat run scripts/interact.ts --network sepolia
```

---

## 📌 Assumptions & Decisions

- Frontend and backend are separate projects.
- Frontend using Etherscan API for transaction history for efficiency.
- Ethers.js v6 used for all Ethereum interactions.
- Caching is applied only for data that does not vary per address. (Gas Price and BlockNumber)
- MongoDB used for balance only (can be expanded later).
- Sepolia used instead of Goerli as Goerli is deprecated.

---

## ⚠️ Known Limitations

- Frontend does not directly call the backend.
- Token interaction is via scripts, not frontend UI (inside contracts).
- No Docker implementation.
