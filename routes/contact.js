const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { sendLeadEmail } = require('../services/emailService');

// POST /api/contact
router.post('/', async (req, res) => {
    try {
        const { name, phone, businessType, message } = req.body;

        // --- Validation ---
        const missing = [];
        if (!name || !name.trim()) missing.push('name');
        if (!phone || !phone.trim()) missing.push('phone');
        if (!businessType || !businessType.trim()) missing.push('businessType');
        if (!message || !message.trim()) missing.push('message');

        if (missing.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missing.join(', ')}`,
            });
        }

        // --- Save to MongoDB ---
        const lead = await Lead.create({
            name: name.trim(),
            phone: phone.trim(),
            businessType: businessType.trim(),
            message: message.trim(),
        });

        // --- Send Email ---
        try {
            await sendLeadEmail(req.body);
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error("Email error:", error);
            return res.status(500).json({ success: false });
        }
    } catch (error) {
        console.error(`[LEAD] Server error: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.',
        });
    }
});

module.exports = router;
