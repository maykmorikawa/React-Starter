import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Por favor, forneça usuário e senha.'
            });
        }

        // Find user - Sequelize syntax
        const user = await User.findOne({ where: { username: username.toLowerCase() } });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas.'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas.'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id, // Sequelize uses 'id' by default, not '_id'
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login realizado com sucesso.',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao realizar login.'
        });
    }
};

export const verify = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token não fornecido.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        res.json({
            success: true,
            user: decoded
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token inválido ou expirado.'
        });
    }
};

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Por favor, forneça usuário e senha.'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { username: username.toLowerCase() } });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Usuário já existe.'
            });
        }

        // Create user
        // Role defaults to 'user' per model
        const user = await User.create({
            username: username.toLowerCase(),
            password,
            role: 'user'
        });

        // Generate token immediately so they are logged in
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'Usuário criado com sucesso.',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao registrar usuário.'
        });
    }
};
