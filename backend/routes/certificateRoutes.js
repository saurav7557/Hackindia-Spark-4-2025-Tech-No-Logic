const express = require("express");
const { 
  issueCertificate, 
  verifyCertificate, 
  verifyCertificateByNumber,
  getUserCertificates, 
  revokeCertificate 
} = require("../controllers/certificateController");

const router = express.Router();

// Issue Certificate
router.post("/issue", issueCertificate);

// Verify Certificate by Token ID
router.get("/verify/:tokenId", verifyCertificate);

// Verify Certificate by Certificate Number
router.get("/verify/number/:certificateNumber", verifyCertificateByNumber);

// Get all certificates for a user
router.get("/user/:address", getUserCertificates);

// Revoke Certificate (only for admins/issuers)
router.post("/revoke/:tokenId", revokeCertificate);

module.exports = router;