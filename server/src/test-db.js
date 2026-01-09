import { sequelize } from './config/database.js';

async function testConnection() {
    console.log('🔍 Testing database connection...');
    try {
        await sequelize.authenticate();
        console.log('✅ Connection has been established successfully.');

        // Check if tables exist
        const [results] = await sequelize.query("SHOW TABLES");
        console.log('📊 Tables in database:', results.map(r => Object.values(r)[0]).join(', ') || 'None');

        process.exit(0);
    } catch (error) {
        console.error('❌ Unable to connect to the database:');
        console.error(error.message);
        process.exit(1);
    }
}

testConnection();
