import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import certificateRoutes from './routes/certificates.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        // Allow any localhost (3000, 5173, etc.)
        if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`\n📨 ${req.method} ${req.path}`);
    if (Object.keys(req.body).length > 0) {
        const sanitizedBody = { ...req.body };
        // Don't log passwords
        if (sanitizedBody.password) sanitizedBody.password = '********';
        console.log('📦 Body:', sanitizedBody);
    }
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada.'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

export default app;
