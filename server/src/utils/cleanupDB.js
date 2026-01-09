import { sequelize } from '../config/database.js';

/**
 * Cleanup redundant unique indexes created by Sequelize sync({ alter: true })
 */
const cleanupIndexes = async () => {
    try {
        console.log('🔍 Starting database index cleanup...');

        // Users Table - Remove username_2, username_3, etc.
        const [usersIndexes] = await sequelize.query('SHOW INDEX FROM Users');
        const redundantUserIndexes = usersIndexes
            .filter(idx => idx.Key_name.startsWith('username_') && idx.Key_name !== 'username')
            .map(idx => idx.Key_name);

        const uniqueUserIndexes = [...new Set(redundantUserIndexes)];
        for (const idxName of uniqueUserIndexes) {
            console.log(`🗑️ Dropping redundant index ${idxName} from Users...`);
            await sequelize.query(`ALTER TABLE Users DROP INDEX ${idxName}`);
        }

        // Certificates Table - Remove certificateId_2, certificateId_3, etc.
        const [certIndexes] = await sequelize.query('SHOW INDEX FROM Certificates');
        const redundantCertIndexes = certIndexes
            .filter(idx => idx.Key_name.startsWith('certificateId_') && idx.Key_name !== 'certificateId')
            .map(idx => idx.Key_name);

        const uniqueCertIndexes = [...new Set(redundantCertIndexes)];
        for (const idxName of uniqueCertIndexes) {
            console.log(`🗑️ Dropping redundant index ${idxName} from Certificates...`);
            await sequelize.query(`ALTER TABLE Certificates DROP INDEX ${idxName}`);
        }

        console.log('✅ Cleanup finished successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Cleanup failed:', error);
        process.exit(1);
    }
};

cleanupIndexes();
