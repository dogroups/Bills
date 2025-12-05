const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if users already exist
        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Users already seeded');
            process.exit(0);
        }

        // Hash passwords
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('admin123', salt);
        const cashierPassword = await bcrypt.hash('cashier123', salt);

        // Create users
        const users = [
            {
                username: 'admin',
                password: adminPassword,
                displayName: 'Admin',
                role: 'admin'
            },
            {
                username: 'cashier',
                password: cashierPassword,
                displayName: 'Cashier',
                role: 'cashier'
            }
        ];

        await User.insertMany(users);
        console.log('Users seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedUsers();
