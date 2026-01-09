import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Award, Calendar, Clock, Shield, Loader, Search, ArrowRight } from 'lucide-react';
import { certificatesAPI } from '../services/api';

interface CertificateData {
    certificateId: string;
    studentName: string;
    courseName: string;
    hours: number;
    issueDate: string;
    status: string;
    issuedAt: string;
}

const ValidateCertificate: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [manualId, setManualId] = useState('');
    const [certificate, setCertificate] = useState<CertificateData | null>(null);
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const validateCertificate = async (certificateId: string) => {
        setIsLoading(true);
        setError('');
        setCertificate(null);
        setIsValid(null);

        try {
            const response = await certificatesAPI.validate(certificateId);

            if (response.valid) {
                setCertificate(response.certificate);
                setIsValid(true);
            } else {
                setIsValid(false);
                setError(response.message || 'Certificado inválido ou revogado');
            }
        } catch (err: any) {
            setIsValid(false);
            setError(err.response?.data?.message || 'Certificado não encontrado ou inválido');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            validateCertificate(id);
        } else {
            setIsValid(null);
            setCertificate(null);
            setIsLoading(false);
        }
    }, [id]);

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualId.trim()) {
            navigate(`/validar/${manualId.trim()}`);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <Loader className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Validando certificado...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"
            >
                {/* Manual Entry Form - Show when no ID or when validation failed/reset */}
                {!id && (
                    <div className="card">
                        <div className="card-header text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gradient">Validar Certificado</h1>
                            <p className="text-sm text-slate-600 mt-2">Digite o código do certificado para verificar sua autenticidade</p>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleManualSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="certificateId" className="block text-sm font-medium text-slate-700 mb-2">
                                        Código de Validação
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            id="certificateId"
                                            type="text"
                                            value={manualId}
                                            onChange={(e) => setManualId(e.target.value)}
                                            className="input-field pl-10"
                                            placeholder="Ex: 550e8400-e29b-41d4-a716-446655440000"
                                            required
                                        />
                                    </div>
                                </div>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-primary w-full flex items-center justify-center gap-2"
                                >
                                    <span>Verificar Autenticidade</span>
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </form>
                        </div>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {id && (isValid && certificate ? (
                        // Valid Certificate
                        <motion.div
                            key="valid"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="card overflow-hidden"
                        >
                            {/* Success Header */}
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                >
                                    <CheckCircle className="w-20 h-20 text-white mx-auto mb-4" />
                                </motion.div>
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    Certificado Autêntico
                                </h1>
                                <p className="text-green-50">
                                    Este certificado foi verificado e é válido
                                </p>
                            </div>

                            {/* Certificate Details */}
                            <div className="p-8">
                                <div className="space-y-6">
                                    {/* Student Name */}
                                    <div className="text-center pb-6 border-b border-slate-100">
                                        <p className="text-sm text-slate-500 mb-2">Certificado emitido para</p>
                                        <h2 className="text-3xl font-bold text-gradient">
                                            {certificate.studentName}
                                        </h2>
                                    </div>

                                    {/* Course Info */}
                                    <div className="bg-primary-50/50 rounded-xl p-6 border border-primary-100">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-primary-600 rounded-lg p-3">
                                                <Award className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-primary-600 font-bold uppercase tracking-wider mb-1">Curso Concluído</p>
                                                <p className="text-xl font-bold text-slate-800">
                                                    {certificate.courseName}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-5 h-5 text-primary-600" />
                                                <div>
                                                    <p className="text-xs text-slate-500">Carga Horária</p>
                                                    <p className="font-bold text-slate-800">{certificate.hours} Horas</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-5 h-5 text-primary-600" />
                                                <div>
                                                    <p className="text-xs text-slate-500">Emissão</p>
                                                    <p className="font-bold text-slate-800">{formatDate(certificate.issueDate)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Validation ID */}
                                    <div className="bg-slate-100/50 rounded-lg p-4 border border-slate-200">
                                        <p className="text-xs text-slate-500 mb-1">ID de Autenticação</p>
                                        <p className="text-sm font-mono text-slate-700 break-all">{certificate.certificateId}</p>
                                    </div>

                                    <button
                                        onClick={() => navigate('/validar')}
                                        className="btn-secondary w-full"
                                    >
                                        Validar outro certificado
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : isValid === false ? (
                        // Invalid Certificate
                        <motion.div
                            key="invalid"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="card overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-8 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                >
                                    <XCircle className="w-20 h-20 text-white mx-auto mb-4" />
                                </motion.div>
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    Certificado Inválido
                                </h1>
                                <p className="text-red-50">
                                    Não foi possível validar este código
                                </p>
                            </div>

                            <div className="p-8">
                                <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
                                    <p className="text-sm text-red-800 text-center">
                                        {error || 'Código de certificado não encontrado ou revogado.'}
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate('/validar')}
                                    className="btn-primary w-full"
                                >
                                    Tentar outro código
                                </button>
                            </div>
                        </motion.div>
                    ) : null)}
                </AnimatePresence>

                <p className="text-center text-xs text-slate-400 mt-8">
                    &copy; {new Date().getFullYear()} Sistema de Certificação • Verificação Oficial
                </p>
            </motion.div>
        </div>
    );
};

export default ValidateCertificate;
