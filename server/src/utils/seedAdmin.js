import dotenv from 'dotenv';
import User from '../models/User.js';
import { connectDB, sequelize } from '../config/database.js';

dotenv.config();

/**
 * Seed initial admin user
 */
const seedAdmin = async () => {
    try {
        // Connect to database
        await connectDB();
        await sequelize.sync(); // Ensure tables exist

        // Check if admin already exists
        const existingAdmin = await User.findOne({ where: { username: 'admin' } });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log('Username: admin');
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            username: 'admin',
            password: 'admin123', // Will be hashed by the hooks
            role: 'admin'
        });

        console.log('✅ Admin user created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 Default Credentials:');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️  IMPORTANT: Change these credentials in production!');
        console.log('');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding admin user:', error);
        process.exit(1);
    }
};

seedAdmin();
