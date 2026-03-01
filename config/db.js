const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('[DB] Connecting to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[DB] Connection failed: ${error.message}`);
        throw error; // Let server.js handle the exit
    }
};

module.exports = connectDB;
