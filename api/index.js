const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/inventory', require('../routes/inventory'));
app.use('/api/sales', require('../routes/sales'));

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Soofi Attars API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Export for Vercel serverless
module.exports = app;
