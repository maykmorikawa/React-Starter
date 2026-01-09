import PDFDocument from 'pdfkit';
import { generateQRCodeBuffer } from './qrCodeGenerator.js';

/**
 * Generate a professional certificate PDF
 * @param {Object} certificateData - Certificate information
 * @returns {Promise<Buffer>} - PDF buffer
 */
export const generateCertificatePDF = async (certificateData) => {
    const { studentName, courseName, hours, issueDate, certificateId, qrCodeUrl } = certificateData;

    return new Promise(async (resolve, reject) => {
        try {
            // Create a new PDF document
            const doc = new PDFDocument({
                size: 'A4',
                layout: 'landscape',
                margins: { top: 50, bottom: 50, left: 50, right: 50 }
            });

            const chunks = [];

            // Collect PDF chunks
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Generate QR Code
            const qrCodeBuffer = await generateQRCodeBuffer(qrCodeUrl);

            // Page dimensions
            const pageWidth = doc.page.width;
            const pageHeight = doc.page.height;

            // Draw decorative border
            doc.lineWidth(3);
            doc.strokeColor('#1e3a8a'); // Dark blue
            doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();

            doc.lineWidth(1);
            doc.strokeColor('#3b82f6'); // Light blue
            doc.rect(35, 35, pageWidth - 70, pageHeight - 70).stroke();

            // Add decorative corner elements
            const cornerSize = 40;
            doc.strokeColor('#fbbf24'); // Gold
            doc.lineWidth(2);

            // Top-left corner
            doc.moveTo(50, 50).lineTo(50 + cornerSize, 50).stroke();
            doc.moveTo(50, 50).lineTo(50, 50 + cornerSize).stroke();

            // Top-right corner
            doc.moveTo(pageWidth - 50, 50).lineTo(pageWidth - 50 - cornerSize, 50).stroke();
            doc.moveTo(pageWidth - 50, 50).lineTo(pageWidth - 50, 50 + cornerSize).stroke();

            // Bottom-left corner
            doc.moveTo(50, pageHeight - 50).lineTo(50 + cornerSize, pageHeight - 50).stroke();
            doc.moveTo(50, pageHeight - 50).lineTo(50, pageHeight - 50 - cornerSize).stroke();

            // Bottom-right corner
            doc.moveTo(pageWidth - 50, pageHeight - 50).lineTo(pageWidth - 50 - cornerSize, pageHeight - 50).stroke();
            doc.moveTo(pageWidth - 50, pageHeight - 50).lineTo(pageWidth - 50, pageHeight - 50 - cornerSize).stroke();

            // Title
            doc.fontSize(36)
                .fillColor('#1e3a8a')
                .font('Helvetica-Bold')
                .text('CERTIFICADO', 0, 100, { align: 'center' });

            doc.fontSize(16)
                .fillColor('#64748b')
                .font('Helvetica')
                .text('DE CONCLUSÃO', 0, 145, { align: 'center' });

            // Divider line
            doc.moveTo(pageWidth / 2 - 150, 180)
                .lineTo(pageWidth / 2 + 150, 180)
                .strokeColor('#fbbf24')
                .lineWidth(2)
                .stroke();

            // "Certificamos que" text
            doc.fontSize(14)
                .fillColor('#374151')
                .font('Helvetica')
                .text('Certificamos que', 0, 210, { align: 'center' });

            // Student name (highlighted)
            doc.fontSize(28)
                .fillColor('#1e3a8a')
                .font('Helvetica-Bold')
                .text(studentName.toUpperCase(), 0, 245, { align: 'center' });

            // Course completion text
            doc.fontSize(14)
                .fillColor('#374151')
                .font('Helvetica')
                .text('concluiu com êxito o curso de', 0, 290, { align: 'center' });

            // Course name
            doc.fontSize(22)
                .fillColor('#1e3a8a')
                .font('Helvetica-Bold')
                .text(courseName, 0, 320, { align: 'center' });

            // Hours information
            doc.fontSize(13)
                .fillColor('#64748b')
                .font('Helvetica')
                .text(`com carga horária de ${hours} horas`, 0, 360, { align: 'center' });

            // Issue date
            const formattedDate = new Date(issueDate).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });

            doc.fontSize(12)
                .fillColor('#374151')
                .text(`Emitido em ${formattedDate}`, 0, 395, { align: 'center' });

            // QR Code
            const qrSize = 80;
            const qrX = pageWidth - 130;
            const qrY = pageHeight - 150; // Moved up from 130

            doc.image(qrCodeBuffer, qrX, qrY, { width: qrSize, height: qrSize });

            // QR Code label
            doc.fontSize(8)
                .fillColor('#64748b')
                .text('Validar certificado', qrX - 10, qrY + qrSize + 5, { width: qrSize + 20, align: 'center' });

            // Certificate ID
            doc.fontSize(9)
                .fillColor('#9ca3af')
                .font('Helvetica')
                .text(`ID: ${certificateId}`, 60, pageHeight - 80, { align: 'left' });

            // Signature line
            const signatureY = pageHeight - 120; // Moved up from 100
            const signatureWidth = 200;
            const signatureX = (pageWidth / 2) - (signatureWidth / 2);

            doc.moveTo(signatureX, signatureY)
                .lineTo(signatureX + signatureWidth, signatureY)
                .strokeColor('#9ca3af')
                .lineWidth(1)
                .stroke();

            doc.fontSize(10)
                .fillColor('#374151')
                .text('Assinatura Autorizada', signatureX, signatureY + 10, { width: signatureWidth, align: 'center' });

            // Finalize PDF
            doc.end();

        } catch (error) {
            console.error('Error generating PDF:', error);
            reject(error);
        }
    });
};
