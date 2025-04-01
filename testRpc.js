const { ethers } = require("ethers");
require("dotenv").config();

const ALCHEMY_RPC_URL = process.env.ALCHEMY_RPC_URL;

console.log("Testing Alchemy Connection...");

async function testConnection() {
    try {
        const provider = new ethers.JsonRpcProvider(ALCHEMY_RPC_URL);
        const blockNumber = await provider.getBlockNumber();
        console.log("✅ Connected! Latest Block:", blockNumber);
    } catch (error) {
        console.error("❌ Connection failed:", error.message);
    }
}

testConnection();
