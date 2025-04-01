# Blockchain-Based Certificate Generation & Validation

## 🚀 Overview
Fake certificates, credential fraud, and manual verification processes are major challenges in education, recruitment, and professional certifications. This project aims to **eliminate credential fraud** by leveraging **blockchain technology** for **secure, tamper-proof, and instantly verifiable digital certificates**.

## 🔗 Features
- **Immutable Certificates** – Certificates stored on a blockchain to prevent forgery.
- **Instant Verification** – Employers and institutions can verify certificates via **QR code** or **blockchain lookups**.
- **Decentralized & Secure** – No central authority required for verification.
- **User-Controlled Access** – Users can securely share credentials.
- **Multi-Purpose Use Case** – Suitable for **universities, professional courses, training programs, and government-issued certifications**.

## 🏗 Tech Stack
### **Backend Tech Stack**
- **Node.js** (JavaScript Runtime)
- **Express.js** (Backend Framework)
- **Ethers.js** (Interacting with Ethereum blockchain)
- **Hardhat** (Ethereum development & testing framework)
- **Ethereum Sepolia Testnet** (For deploying smart contracts)
- **Alchemy** (RPC Provider for Ethereum)
- **IPFS (InterPlanetary File System)** (Decentralized storage for certificates)
- **Pinata** (IPFS file management API)
- **dotenv** (Managing environment variables)
- **Axios** (Making API requests)
- **FormData** (Handling file uploads for IPFS)

### **Frontend Tech Stack**
- **React.js (Vite)** (Modern frontend framework)
- **Tailwind CSS** (For UI styling)
- **MetaMask / WalletConnect** (Web3 Authentication)
- **QR Code Generator** (For instant certificate verification)

## ⚡ Architecture
1. **Certificate Issuance** – Institutions issue certificates as NFTs (ERC-721) on the blockchain.
2. **Metadata Storage** – Certificate details are stored on **IPFS** for secure, off-chain access.
3. **Verification Mechanism** – Employers and institutions can scan a **QR code** or search via blockchain to verify authenticity.
4. **User Access & Control** – Certificate owners can share or revoke access as needed.

## 📌 Smart Contract Workflow
1. **Institution Issues a Certificate**
   - Calls `issueCertificate(address _recipient, string _metadataURI)`.
   - Stores certificate details on **IPFS**.
   - Mints an NFT as proof of credential ownership.
2. **User Stores & Shares Certificate**
   - Retrieves certificate via blockchain lookup.
   - Shares a **verification link** with employers.
3. **Employer Verifies Authenticity**
   - Scans **QR Code** or enters **certificate ID**.
   - Queries blockchain for proof of validity.

## 🔧 Installation & Setup
### Prerequisites
- **Node.js** (v16+)
- **Hardhat** (Ethereum development environment)
- **MetaMask** (for Web3 authentication)
- **MongoDB (Optional)** (if storing additional metadata)

### Clone the Repository
```bash
 git clone https://github.com/saurav7557/Hackindia-Spark-4-2025-Tech-No-Logic.git
 cd Hackindia-Spark-4-2025-Tech-No-Logic
```

### Install Dependencies
```bash
 npm install
```

### Backend Setup
1. **Create a `.env` file** in the root directory and add the following:

```ini
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
PORT=5000

ALCHEMY_RPC_URL=your_alchemy_rpc_url
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
WEB3_STORAGE_API_KEY=your_web3_storage_api_key
PINATA_API_KEY=your_pinata_api_key
PINATA_API_SECRET=your_pinata_api_secret
```

2. **Start the Backend Server**
```bash
 node app
```

### Start the Development Server
```bash
 npm run dev
```

### Deploy Smart Contracts (Local Hardhat Node)
```bash
 npx hardhat node
 npx hardhat run scripts/deploy.js --network localhost
```

### Connect to a Testnet
Modify **hardhat.config.js** with your **Alchemy/Infura RPC URL** and deploy:
```bash
 npx hardhat run scripts/deploy.js --network sepolia
```

## 📜 API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/issueCertificate` | POST | Issues a blockchain-based certificate |
| `/api/verifyCertificate/:id` | GET | Verifies the authenticity of a certificate |

## 🎨 UI/UX Features
- **Certificate Dashboard** – Users can **view, share, and manage** issued certificates.
- **Real-Time Verification** – Instant lookup by **scanning QR codes**.
- **Dark Mode & Mobile-Friendly** UI.

## 🚀 Future Enhancements
- **Layer-2 Integration** (Polygon, Arbitrum) for **scalability** and **low gas fees**.
- **Soulbound Tokens (SBTs)** for **non-transferable, identity-based credentials**.
- **AI-Powered Fraud Detection** to flag suspicious activities.
- **Integration with Learning Platforms** (Coursera, Udemy, LinkedIn) for seamless verification.

## 🤝 Contributing
1. **Fork** the repository.
2. **Create a new branch** (`feature-new`).
3. **Commit your changes** (`git commit -m 'Added new feature'`).
4. **Push to your branch** and submit a PR!

## 📄 License
This project is licensed under the **MIT License**.

## 📩 Contact
For any queries or collaborations, reach out to **sauravkumar9447@gmail.com or sktigpta@gmail.com** 

---
### 🚀 Build the Future of Digital Credentials!

