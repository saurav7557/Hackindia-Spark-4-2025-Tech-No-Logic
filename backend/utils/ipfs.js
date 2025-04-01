const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

if (!PINATA_API_KEY || !PINATA_API_SECRET) {
  console.error("Pinata API credentials are missing in .env");
  process.exit(1);
}

// Function to upload JSON to Pinata
exports.uploadToPinata = async (jsonData) => {
  try {
    const jsonBuffer = Buffer.from(JSON.stringify(jsonData));

    const formData = new FormData();
    formData.append("file", jsonBuffer, { filename: "metadata.json" });

    // Fixed headers for Pinata authentication
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_API_SECRET,
          ...formData.getHeaders(),
        },
      }
    );

    if (response.data && response.data.IpfsHash) {
      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      console.log("Uploaded to IPFS via Pinata:", ipfsUrl);
      return ipfsUrl;
    } else {
      throw new Error("Pinata upload failed: Invalid response");
    }
  } catch (error) {
    console.error("Pinata IPFS Upload Error:", error.response ? error.response.data : error.message);
    throw new Error("Failed to upload JSON to Pinata");
  }
};