const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Organization = require('../models/organizationModel.js');
const { registerValidation, loginValidation } = require('../utils/validation.js');

// Organization Registration
router.post('/register', async (req, res) => {
  try {
    // Validate Data
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if Organization exists
    const emailExists = await Organization.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send('Email already exists');

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create Organization
    const organization = new Organization({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      walletAddress: req.body.walletAddress,
      contactPerson: req.body.contactPerson,
      website: req.body.website
    });

    const savedOrg = await organization.save();
    res.status(201).json({
      _id: savedOrg._id,
      name: savedOrg.name,
      email: savedOrg.email,
      walletAddress: savedOrg.walletAddress
    });

  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Organization Login
router.post('/login', async (req, res) => {
    try {
      console.log("Login attempt:", req.body); // Log the request body
      
      // Validate Data
      const { error } = loginValidation(req.body);
      if (error) return res.status(400).send(error.details[0].message);
  
      // Check if Organization exists
      const organization = await Organization.findOne({ email: req.body.email });
      if (!organization) {
        console.log("Organization not found");
        return res.status(400).send('Invalid credentials');
      }
  
      // Validate Password
      const validPass = await bcrypt.compare(req.body.password, organization.password);
      console.log("Password valid:", validPass); // Log the comparison result
  
      if (!validPass) {
        console.log("Invalid password");
        return res.status(400).send('Invalid credentials');
      }
  
      // Create JWT Token
      const token = jwt.sign(
        { _id: organization._id, walletAddress: organization.walletAddress },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.header('auth-token', token).json({
        token,
        organization: {
          _id: organization._id,
          name: organization.name,
          email: organization.email,
          walletAddress: organization.walletAddress
        }
      });
  
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

  const auth = require('../middleware/auth'); // Import auth middleware

  // Get Current Organization (Authenticated User)
  router.get('/me', auth, async (req, res) => {
    try {
      const organizationId = req.user._id; // Extract from verified token
  
      const organization = await Organization.findById(organizationId);
      if (!organization) return res.status(404).send('Organization not found');
  
      res.json({
        _id: organization._id,
        name: organization.name,
        email: organization.email,
        walletAddress: organization.walletAddress,
      });
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
  
  

module.exports = router;