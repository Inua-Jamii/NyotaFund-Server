// app.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json()); // For parsing JSON payloads

// Environment variables
const API_KEY = process.env.API_KEY; // Your API key
const CHANNEL_ID = process.env.CHANNEL_ID; // Your channel id
const API_URL = 'https://api.swiftwallet.com/stk-push'; // Replace with actual API endpoint

// Endpoint to initiate STK Push
app.post('/stk-push', async (req, res) => {
  const { phoneNumber, amount, description } = req.body;

  // Validate input
  if (!phoneNumber || !amount || !description) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const checkoutRequestId = `ws_CO_${Date.now()}`; // Unique request ID
  const merchantRequestId = `MR_${Date.now()}`;

  const payload = {
    api_key: API_KEY,
    channel_id: CHANNEL_ID,
    amount: amount,
    phone_number: phoneNumber,
    description: description,
    checkout_request_id: checkoutRequestId,
    merchant_request_id: merchantRequestId,
  };

  try {
    const response = await axios.post(API_URL, payload);
    // Assuming the API responds with success message
    res.json({
      success: true,
      message: 'STK Push sent successfully. Please check your phone.',
      data: response.data,
    });
  } catch (error) {
    console.error('Error initiating STK Push:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to send STK Push' });
  }
});

// Callback endpoint to receive payment updates
app.post('/callback', (req, res) => {
  const payload = req.body;

  // Log the callback payload
  console.log('Callback received:', payload);

  // You can process the payload here, e.g., update database, notify user, etc.

  res.json({ success: true, message: 'Callback received' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
