require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const path = require('path');

// --- Validate Required Environment Variables ---
const requiredEnvVars = ['MONGO_URI', 'RESEND_API_KEY'];
const missing = requiredEnvVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
    console.error(`[FATAL] Missing environment variables: ${missing.join(', ')}`);
    console.error('[FATAL] Set these in Render Dashboard → Environment tab');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 10000;

// --- Security ---
app.use(helmet({
    contentSecurityPolicy: false, // Disabled for static site assets (fonts/images)
}));
app.set('trust proxy', 1);

// --- Rate Limiting (max 10 submissions per 15 min per IP) ---
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again later.' },
});

// --- Body Parsing ---
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// --- API Routes ---
app.use('/api/contact', contactLimiter, require('./routes/contact'));

// --- Serve Frontend Static Files ---
app.use(express.static(path.join(__dirname, 'public')));

// --- Fallback Route (SPA support / Catch-all for frontend) ---
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.stack}`);
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
    });
});

// --- Start ---
const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`[SERVER] Running on port ${PORT}`);
        });
    } catch (error) {
        console.error(`[FATAL] Server failed to start: ${error.message}`);
        process.exit(1);
    }
};

start();
