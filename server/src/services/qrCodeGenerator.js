import QRCode from 'qrcode';

/**
 * Generate QR Code as Data URL
 * @param {string} url - The URL to encode in the QR code
 * @returns {Promise<string>} - Data URL of the QR code image
 */
export const generateQRCode = async (url) => {
    try {
        const qrCodeDataURL = await QRCode.toDataURL(url, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.95,
            margin: 1,
            width: 200,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        return qrCodeDataURL;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code');
    }
};

/**
 * Generate QR Code as Buffer
 * @param {string} url - The URL to encode in the QR code
 * @returns {Promise<Buffer>} - Buffer of the QR code image
 */
export const generateQRCodeBuffer = async (url) => {
    try {
        const buffer = await QRCode.toBuffer(url, {
            errorCorrectionLevel: 'H',
            type: 'png',
            quality: 0.95,
            margin: 1,
            width: 200,
        });

        return buffer;
    } catch (error) {
        console.error('Error generating QR code buffer:', error);
        throw new Error('Failed to generate QR code');
    }
};
