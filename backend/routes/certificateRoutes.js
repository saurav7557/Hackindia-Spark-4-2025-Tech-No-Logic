const express = require("express");
const { 
  issueCertificate, 
  verifyCertificate, 
  verifyCertificateByNumber,
  getUserCertificates, 
  revokeCertificate 
} = require("../controllers/certificateController");

const router = express.Router();
router.post("/issue", issueCertificate);
router.get("/verify/:tokenId", verifyCertificate);
router.get("/verify/number/:certificateNumber", verifyCertificateByNumber);
router.get("/user/:address", getUserCertificates);
router.post("/revoke/:tokenId", revokeCertificate);

module.exports = router;