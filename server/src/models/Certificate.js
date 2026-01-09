import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Certificate = sequelize.define('Certificate', {
    certificateId: {
        type: DataTypes.STRING, // Store UUID as string
        allowNull: false,
        unique: true,
    },
    studentName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    courseName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    hours: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    issueDate: {
        type: DataTypes.DATEONLY, // Or DATE if you need time
        allowNull: false,
    },
    qrCodeUrl: {
        type: DataTypes.TEXT, // URL can be long
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'revoked'),
        defaultValue: 'active',
    },
});

export default Certificate;
