require("dotenv").config();
const { ethers } = require("ethers");

const contractABI = require("./CertificateNFT.json"); // Ensure this is correctly formatted
const contractAddress = "0x2f4636BD58F6Eaef0645a41691c6A6CEEFC2737d"

// Load environment variables
const ALCHEMY_RPC_URL = process.env.ALCHEMY_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Ensure RPC URL is correctly loaded
if (!ALCHEMY_RPC_URL) {
    console.error("❌ ERROR: ALCHEMY_RPC_URL is missing");
    process.exit(1);
}

// Initialize Web3 Provider
const provider = new ethers.JsonRpcProvider(ALCHEMY_RPC_URL, "sepolia");

// Ensure Private Key is set
if (!PRIVATE_KEY) {
    console.error("❌ ERROR: PRIVATE_KEY is missing");
    process.exit(1);
}

// Create Wallet
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, contractABI.abi, wallet);

// Verify connection
(async () => {
    try {
        const blockNumber = await provider.getBlockNumber();    
        console.log(`✅ Connected to Sepolia! Latest Block: ${blockNumber}`);
    } catch (error) {
        console.error("❌ Web3 Connection Failed:", error.message);
        process.exit(1);
    }
})();

module.exports = { provider, wallet, contract };
