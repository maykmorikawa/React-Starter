import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import Certificate from '../models/Certificate.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { generateCertificatePDF } from '../services/pdfGenerator.js';

const router = express.Router();

/**
 * @route   POST /api/certificates
 * @desc    Create a new certificate
 * @access  Private (Admin only)
 */
router.post('/', authMiddleware, adminOnly, async (req, res) => {
    try {
        const { studentName, courseName, hours, issueDate } = req.body;

        // Validate input
        if (!studentName || !courseName || !hours || !issueDate) {
            return res.status(400).json({
                success: false,
                message: 'Todos os campos são obrigatórios.'
            });
        }

        // Generate unique certificate ID
        const certificateId = uuidv4();

        // Generate QR code URL
        const qrCodeUrl = `${process.env.VALIDATION_BASE_URL}/${certificateId}`;

        // Create certificate - Sequelize syntax
        const certificate = await Certificate.create({
            certificateId,
            studentName,
            courseName,
            hours: parseInt(hours),
            issueDate: new Date(issueDate),
            qrCodeUrl,
            status: 'active'
        });

        res.status(201).json({
            success: true,
            message: 'Certificado criado com sucesso.',
            certificate: {
                id: certificate.id,
                certificateId: certificate.certificateId,
                studentName: certificate.studentName,
                courseName: certificate.courseName,
                hours: certificate.hours,
                issueDate: certificate.issueDate,
                qrCodeUrl: certificate.qrCodeUrl,
                status: certificate.status,
                createdAt: certificate.createdAt
            }
        });

    } catch (error) {
        console.error('Error creating certificate:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar certificado.'
        });
    }
});

/**
 * @route   GET /api/certificates
 * @desc    Get all certificates
 * @access  Private (Admin only)
 */
router.get('/', authMiddleware, adminOnly, async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Build query - Sequelize syntax with Op
        const where = search
            ? {
                [Op.or]: [
                    { studentName: { [Op.like]: `%${search}%` } },
                    { courseName: { [Op.like]: `%${search}%` } },
                    { certificateId: { [Op.like]: `%${search}%` } }
                ]
            }
            : {};

        const { count, rows } = await Certificate.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            certificates: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Error fetching certificates:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar certificados.'
        });
    }
});

/**
 * @route   GET /api/certificates/:id
 * @desc    Validate and get certificate by ID (Public validation)
 * @access  Public
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const certificate = await Certificate.findOne({
            where: {
                certificateId: id,
                status: 'active'
            }
        });

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificado não encontrado ou inválido.',
                valid: false
            });
        }

        res.json({
            success: true,
            valid: true,
            message: 'Certificado Autêntico',
            certificate: {
                certificateId: certificate.certificateId,
                studentName: certificate.studentName,
                courseName: certificate.courseName,
                hours: certificate.hours,
                issueDate: certificate.issueDate,
                status: certificate.status,
                issuedAt: certificate.createdAt
            }
        });

    } catch (error) {
        console.error('Error validating certificate:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao validar certificado.'
        });
    }
});

/**
 * @route   GET /api/certificates/:id/download
 * @desc    Download certificate PDF
 * @access  Private (Admin only)
 */
router.get('/:id/download', authMiddleware, adminOnly, async (req, res) => {
    try {
        const { id } = req.params;

        const certificate = await Certificate.findOne({ where: { certificateId: id } });

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificado não encontrado.'
            });
        }

        // Generate PDF
        const pdfBuffer = await generateCertificatePDF({
            studentName: certificate.studentName,
            courseName: certificate.courseName,
            hours: certificate.hours,
            issueDate: certificate.issueDate,
            certificateId: certificate.certificateId,
            qrCodeUrl: certificate.qrCodeUrl
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=certificado-${certificate.certificateId}.pdf`);
        res.setHeader('Content-Length', pdfBuffer.length);

        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error downloading certificate:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao gerar PDF do certificado.'
        });
    }
});

/**
 * @route   PATCH /api/certificates/:id/status
 * @desc    Toggle certificate status (active/inactive)
 * @access  Private (Admin only)
 */
router.patch('/:id/status', authMiddleware, adminOnly, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status inválido. Use "active" ou "inactive".'
            });
        }

        const certificate = await Certificate.findOne({ where: { certificateId: id } });

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificado não encontrado.'
            });
        }

        if (certificate.status === 'revoked') {
            return res.status(400).json({
                success: false,
                message: 'Não é possível alterar o status de um certificado revogado.'
            });
        }

        certificate.status = status;
        await certificate.save();

        res.json({
            success: true,
            message: `Certificado ${status === 'active' ? 'ativado' : 'desativado'} com sucesso.`,
            certificate
        });

    } catch (error) {
        console.error('Error updating certificate status:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar status do certificado.'
        });
    }
});

/**
 * @route   DELETE /api/certificates/:id
 * @desc    Revoke a certificate (soft delete)
 * @access  Private (Admin only)
 */
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
    try {
        const { id } = req.params;

        const certificate = await Certificate.findOne({ where: { certificateId: id } });

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: 'Certificado não encontrado.'
            });
        }

        // Update status
        certificate.status = 'revoked';
        await certificate.save();

        res.json({
            success: true,
            message: 'Certificado revogado com sucesso.'
        });

    } catch (error) {
        console.error('Error revoking certificate:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao revogar certificado.'
        });
    }
});

export default router;
