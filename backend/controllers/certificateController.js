const { contract } = require("../utils/web3");
const { uploadToPinata } = require("../utils/ipfs");

// In-memory counter for certificate numbers (in production, use a database)
let certificateCounter = 1;

// Function to generate certificate number
const generateCertificateNumber = (name, course, date) => {
  // Extract first letters of first and last name
  const nameParts = name.split(' ');
  const firstInitial = nameParts[0] ? nameParts[0][0].toUpperCase() : 'X';
  const lastInitial = nameParts[nameParts.length - 1] ? 
                      nameParts[nameParts.length - 1][0].toUpperCase() : 'X';
  
  // Extract first letter of course
  const courseInitial = course ? course[0].toUpperCase() : 'C';
  
  // Format date as YYYYMMDD
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  // Add 1 to month since getMonth() returns 0-11
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const formattedDate = `${year}${month}${day}`;
  
  // Add counter and format to 4 digits
  const counterFormatted = String(certificateCounter++).padStart(4, '0');
  
  return `${firstInitial}${lastInitial}${courseInitial}-${formattedDate}-${counterFormatted}`;
};

// Store certificate numbers mapped to token IDs (in production, use a database)
const certificateNumberToTokenId = new Map();

// Issue Certificate
exports.issueCertificate = async (req, res, next) => {
  try {
    console.log("Incoming Request Data:", req.body);

    const {
      recipient,
      name,
      course,
      date,
      organization = req.body.organization || "Blockchain Academy",
      issuer = req.body.issuer || "Blockchain Certificate Authority",
      validUntil = req.body.validUntil || "",
      courseDescription = req.body.courseDescription || "",
      grade = req.body.grade || "",
      achievementLevel = req.body.achievementLevel || "",
      skills = req.body.skills || [],
      duration = req.body.duration || "",
      // Allow custom certificate number or generate one
      certificateNumber = req.body.certificateNumber || null,
      issueDate = req.body.issueDate || new Date().toISOString().split('T')[0],
      imageUrl = req.body.imageUrl || ""
    } = req.body;

    // Check required fields
    if (!recipient || !name || !course || !date) {
      return res.status(400).json({ error: "Missing required fields: recipient, name, course, date" });
    }

    // Validate recipient address
    if (!recipient.startsWith('0x') || recipient.length !== 42) {
      return res.status(400).json({ error: "Invalid recipient wallet address" });
    }

    // Generate or use provided certificate number
    const generatedCertificateNumber = certificateNumber || generateCertificateNumber(name, course, date);

    // Generate comprehensive JSON Metadata
    const certificateMetadata = {
      // Core Details
      recipient,
      name,
      course,
      date,
      
      // Organization Details
      organization,
      issuer,
      
      // Certificate Details
      certificateNumber: generatedCertificateNumber,
      issueDate,
      validUntil,
      
      // Course Details
      courseDescription,
      duration,
      
      // Achievement Details
      grade,
      achievementLevel,
      skills: Array.isArray(skills) ? skills : [skills].filter(Boolean),
      
      // Visual Elements
      imageUrl,
      
      // Verification Data
      verificationMethod: "Ethereum Blockchain",
      network: "Sepolia",
      contractAddress: contract.target,
      timestamp: new Date().toISOString()
    };

    // Upload JSON to IPFS using Pinata (returns IPFS link)
    let tokenURI;
    try {
      tokenURI = await uploadToPinata(certificateMetadata);
      console.log("Certificate metadata uploaded to IPFS:", tokenURI);
    } catch (uploadError) {
      console.error("🔥 Error Uploading to Pinata:", uploadError.message);
      return res.status(500).json({ error: "Failed to upload certificate metadata to IPFS." });
    }

    // Generate Hash for blockchain verification
    const certificateHash = "0x" + Buffer.from(JSON.stringify(certificateMetadata)).toString("hex");

    // Issue Certificate on Blockchain
    let tx;
    try {
      console.log(`Issuing certificate to ${recipient} with URI: ${tokenURI}`);
      tx = await contract.issueCertificate(recipient, tokenURI, certificateHash);
      const receipt = await tx.wait();
      
      // Extract token ID from events (assuming your contract emits an event with the token ID)
      let tokenId;
      try {
        // This will depend on your specific contract implementation
        // Example: looking for Transfer event from ERC721
        const transferEvent = receipt.logs
          .find(log => log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef');
        
        if (transferEvent) {
          // The token ID is usually in the third topic for Transfer events
          tokenId = parseInt(transferEvent.topics[3], 16);
        }
      } catch (eventError) {
        console.warn("⚠️ Could not extract token ID from transaction receipt:", eventError.message);
      }

      // Store certificate number to token ID mapping
      if (tokenId) {
        certificateNumberToTokenId.set(generatedCertificateNumber, tokenId.toString());
      }

      console.log("✅ Certificate issued on blockchain:", tx.hash);
      console.log("✅ Certificate Number:", generatedCertificateNumber);
      
      return res.status(200).json({
        message: "Certificate issued successfully",
        transactionHash: tx.hash,
        tokenURI,
        tokenId: tokenId ? tokenId.toString() : "Unknown",
        certificateNumber: generatedCertificateNumber,
        certificateDetails: {
          recipient,
          name,
          course,
          issuer,
          certificateNumber: generatedCertificateNumber
        }
      });
    } catch (blockchainError) {
      console.error("🔥 Error Issuing Certificate on Blockchain:", blockchainError.message);
      return res.status(500).json({ error: "Failed to issue certificate on blockchain." });
    }
  } catch (error) {
    console.error("🔥 Error Issuing Certificate:", error.message);
    return res.status(500).json({ error: "An unexpected error occurred while issuing the certificate." });
  }
};

// Verify Certificate by Token ID
exports.verifyCertificate = async (req, res, next) => {
  try {
    const { tokenId } = req.params;

    if (!tokenId) {
      return res.status(400).json({ error: "Token ID is required." });
    }

    console.log("Verifying Certificate with Token ID:", tokenId);

    // Check contract and method
    if (!contract || !contract.tokenURI) {
      return res.status(500).json({ error: "Blockchain contract or tokenURI method not available." });
    }

    // Verify the certificate exists and get its URI
    let tokenURI, owner;
    try {
      // Get the token URI from the contract
      tokenURI = await contract.tokenURI(tokenId);
      
      // Get the current owner of the certificate
      owner = await contract.ownerOf(tokenId);
      
      console.log("✅ Certificate Found:", tokenURI);
      console.log("✅ Certificate Owner:", owner);
      
      // Fetch the metadata from IPFS
      const metadataResponse = await fetch(tokenURI);
      
      if (!metadataResponse.ok) {
        throw new Error(`Failed to fetch metadata: ${metadataResponse.status}`);
      }
      
      const metadata = await metadataResponse.json();
      
      return res.status(200).json({
        verified: true,
        tokenId,
        tokenURI,
        owner,
        metadata,
        verificationTimestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("🔥 Error Verifying Certificate:", error.message);
      
      // Check if the error is due to nonexistent token
      if (error.message.includes("nonexistent token") || error.message.includes("invalid token ID")) {
        return res.status(404).json({ 
          verified: false, 
          error: "Certificate does not exist or has been revoked." 
        });
      }
      
      return res.status(500).json({ 
        verified: false, 
        error: "Failed to verify certificate on blockchain." 
      });
    }
  } catch (error) {
    console.error("🔥 Error Verifying Certificate:", error.message);
    return res.status(500).json({ error: "An unexpected error occurred while verifying the certificate." });
  }
};

// Verify Certificate by Certificate Number
exports.verifyCertificateByNumber = async (req, res, next) => {
  try {
    const { certificateNumber } = req.params;

    if (!certificateNumber) {
      return res.status(400).json({ error: "Certificate number is required." });
    }

    console.log("Verifying Certificate with Number:", certificateNumber);

    // Look up token ID from certificate number
    const tokenId = certificateNumberToTokenId.get(certificateNumber);

    if (!tokenId) {
      return res.status(404).json({ 
        verified: false, 
        error: "Certificate number not found. It may not exist or has been revoked." 
      });
    }

    // Check contract and method
    if (!contract || !contract.tokenURI) {
      return res.status(500).json({ error: "Blockchain contract or tokenURI method not available." });
    }

    // Verify the certificate exists and get its URI
    let tokenURI, owner;
    try {
      // Get the token URI from the contract
      tokenURI = await contract.tokenURI(tokenId);
      
      // Get the current owner of the certificate
      owner = await contract.ownerOf(tokenId);
      
      console.log("✅ Certificate Found:", tokenURI);
      console.log("✅ Certificate Owner:", owner);
      
      // Fetch the metadata from IPFS
      const metadataResponse = await fetch(tokenURI);
      
      if (!metadataResponse.ok) {
        throw new Error(`Failed to fetch metadata: ${metadataResponse.status}`);
      }
      
      const metadata = await metadataResponse.json();
      
      return res.status(200).json({
        verified: true,
        certificateNumber,
        tokenId,
        tokenURI,
        owner,
        metadata,
        verificationTimestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("🔥 Error Verifying Certificate:", error.message);
      
      // Check if the error is due to nonexistent token
      if (error.message.includes("nonexistent token") || error.message.includes("invalid token ID")) {
        return res.status(404).json({ 
          verified: false, 
          error: "Certificate does not exist or has been revoked." 
        });
      }
      
      return res.status(500).json({ 
        verified: false, 
        error: "Failed to verify certificate on blockchain." 
      });
    }
  } catch (error) {
    console.error("🔥 Error Verifying Certificate:", error.message);
    return res.status(500).json({ error: "An unexpected error occurred while verifying the certificate." });
  }
};

// Get All Certificates For A User
exports.getUserCertificates = async (req, res, next) => {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({ error: "Wallet address is required." });
    }
    
    console.log("Fetching certificates for address:", address);
    
    // This implementation depends on your contract methods
    // You'll need to have a method to get all token IDs owned by an address
    let tokenIds;
    try {
      // Example: If your contract has a method like getTokensOfOwner
      tokenIds = await contract.getTokensOfOwner(address);
      // If not, you might need to implement a custom solution or use events
    } catch (error) {
      console.error("🔥 Error fetching user certificates:", error.message);
      return res.status(500).json({ error: "Failed to fetch certificates for the given address." });
    }
    
    // Get metadata for each token ID
    const certificates = await Promise.all(
      tokenIds.map(async (tokenId) => {
        try {
          const tokenURI = await contract.tokenURI(tokenId);
          const response = await fetch(tokenURI);
          const metadata = await response.json();
          
          return {
            tokenId: tokenId.toString(),
            tokenURI,
            metadata
          };
        } catch (error) {
          console.error(`Error fetching metadata for token ${tokenId}:`, error.message);
          return { tokenId: tokenId.toString(), error: "Failed to fetch metadata" };
        }
      })
    );
    
    return res.status(200).json({
      address,
      certificateCount: certificates.length,
      certificates
    });
  } catch (error) {
    console.error("🔥 Error fetching user certificates:", error.message);
    return res.status(500).json({ error: "An unexpected error occurred while fetching user certificates." });
  }
};

// Revoke Certificate (only for certificate issuer)
exports.revokeCertificate = async (req, res, next) => {
  try {
    const { tokenId } = req.params;
    const { reason } = req.body;
    
    if (!tokenId) {
      return res.status(400).json({ error: "Token ID is required." });
    }
    
    console.log("Revoking Certificate with Token ID:", tokenId);
    
    // Check if the contract has a revoke method
    if (!contract || !contract.revokeCertificate) {
      return res.status(500).json({ error: "Blockchain contract or revoke method not available." });
    }
    
    // Get certificate number before revoking
    let certificateNumber;
    try {
      const tokenURI = await contract.tokenURI(tokenId);
      const response = await fetch(tokenURI);
      const metadata = await response.json();
      certificateNumber = metadata.certificateNumber;
    } catch (error) {
      console.warn("⚠️ Could not retrieve certificate number before revocation:", error.message);
    }
    
    // Revoke the certificate
    try {
      const tx = await contract.revokeCertificate(tokenId, reason || "Certificate revoked");
      await tx.wait();
      
      console.log("✅ Certificate revoked:", tx.hash);
      
      // Remove from certificate number mapping if found
      if (certificateNumber) {
        certificateNumberToTokenId.delete(certificateNumber);
      }
      
      return res.status(200).json({
        message: "Certificate revoked successfully",
        transactionHash: tx.hash,
        tokenId,
        certificateNumber,
        reason: reason || "Certificate revoked"
      });
    } catch (error) {
      console.error("🔥 Error revoking certificate:", error.message);
      return res.status(500).json({ error: "Failed to revoke certificate on blockchain." });
    }
  } catch (error) {
    console.error("🔥 Error revoking certificate:", error.message);
    return res.status(500).json({ error: "An unexpected error occurred while revoking the certificate." });
  }
};