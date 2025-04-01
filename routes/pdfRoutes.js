const express = require("express");
const PDFDocument = require("pdfkit");
const fetch = require("node-fetch");
const QRCode = require("qrcode");

const router = express.Router();

router.post("/generate/:certificateNumber", async (req, res) => {
  try {
    const { certificateNumber } = req.params;
    if (!certificateNumber) {
      return res.status(400).json({ error: "Certificate number is required." });
    }

    // Fetch certificate details
    const verificationResponse = await fetch(
      `http://localhost:3000/api/verify/${certificateNumber}`
    );
    const verificationData = await verificationResponse.json();

    if (!verificationResponse.ok || !verificationData.verified) {
      return res.status(404).json({ error: "Certificate not found or invalid." });
    }

    const {
      metadata: {
        name,
        course,
        issueDate,
        organization,
        issuer,
        duration,
        grade,
        achievementLevel,
        skills,
        verificationMethod,
        network,
        contractAddress,
      },
      tokenId,
    } = verificationData;

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Disposition", `attachment; filename=Certificate_${certificateNumber}.pdf`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Title
    doc.fontSize(24).text("Certificate of Completion", { align: "center", underline: true });
    doc.moveDown(2);

    // Recipient Details
    doc.fontSize(18).text(`Awarded to: ${name}`, { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text(`For successfully completing: ${course}`, { align: "center" });
    doc.moveDown();

    // Issuer Details
    doc.fontSize(14).text(`Issued By: ${organization}`, { align: "center" });
    doc.moveDown();
    doc.text(`Instructor: ${issuer}`, { align: "center" });
    doc.moveDown();
    doc.text(`Issue Date: ${issueDate}`, { align: "center" });
    doc.moveDown();
    doc.text(`Duration: ${duration}`, { align: "center" });
    doc.moveDown();
    doc.text(`Grade Achieved: ${grade}`, { align: "center" });
    doc.moveDown();
    doc.text(`Achievement Level: ${achievementLevel}`, { align: "center" });
    doc.moveDown();
    
    // Skills Section
    doc.fontSize(14).text(`Skills Acquired: ${skills.join(", ")}`, { align: "center" });
    doc.moveDown();

    // Blockchain Verification Details
    doc.fontSize(12).text(`Verification Method: ${verificationMethod}`, { align: "center" });
    doc.moveDown();
    doc.text(`Blockchain Network: ${network}`, { align: "center" });
    doc.moveDown();
    doc.text(`Contract Address: ${contractAddress}`, { align: "center" });
    doc.moveDown();
    doc.text(`Token ID: ${tokenId}`, { align: "center" });
    doc.moveDown(2);

    // QR Code for Verification (Optional)
    const verificationLink = `http://localhost:3000/verify/${certificateNumber}`;
    const qrCodeImage = await QRCode.toDataURL(verificationLink);
    doc.image(qrCodeImage, { fit: [100, 100], align: "center" });
    doc.moveDown();
    doc.fontSize(10).text("Scan the QR code to verify the certificate.", { align: "center" });

    doc.end();
  } catch (error) {
    console.error("🔥 Error generating certificate PDF:", error.message);
    res.status(500).json({ error: "Failed to generate certificate PDF." });
  }
});

module.exports = router;