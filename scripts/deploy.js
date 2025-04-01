const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contract with account:", deployer.address);

    // Deploy contract with the deployer's address as the constructor argument
    const CertificateNFT = await ethers.getContractFactory("CertificateNFT");
    const contract = await CertificateNFT.deploy(deployer.address);

    // Wait for the contract deployment
    await contract.waitForDeployment(); // Fix: Use waitForDeployment() instead of deployed()

    console.log("Contract deployed at:", contract.target); // Fix: Use contract.target instead of contract.address
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
