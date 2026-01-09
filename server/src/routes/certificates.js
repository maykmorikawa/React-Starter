import express from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import {
    createCertificate,
    getAllCertificates,
    getCertificateById,
    downloadCertificate,
    updateCertificateStatus,
    revokeCertificate
} from '../controllers/certificateController.js';

const router = express.Router();

/**
 * @route   POST /api/certificates
 * @desc    Create a new certificate
 * @access  Private (Admin only)
 */
router.post('/', authMiddleware, adminOnly, createCertificate);

/**
 * @route   GET /api/certificates
 * @desc    Get all certificates
 * @access  Private (Admin only)
 */
router.get('/', authMiddleware, adminOnly, getAllCertificates);

/**
 * @route   GET /api/certificates/:id
 * @desc    Validate and get certificate by ID (Public validation)
 * @access  Public
 */
router.get('/:id', getCertificateById);

/**
 * @route   GET /api/certificates/:id/download
 * @desc    Download certificate PDF
 * @access  Private (Admin only)
 */
router.get('/:id/download', authMiddleware, adminOnly, downloadCertificate);

/**
 * @route   PATCH /api/certificates/:id/status
 * @desc    Toggle certificate status (active/inactive)
 * @access  Private (Admin only)
 */
router.patch('/:id/status', authMiddleware, adminOnly, updateCertificateStatus);

/**
 * @route   DELETE /api/certificates/:id
 * @desc    Revoke a certificate (soft delete)
 * @access  Private (Admin only)
 */
router.delete('/:id', authMiddleware, adminOnly, revokeCertificate);

export default router;
