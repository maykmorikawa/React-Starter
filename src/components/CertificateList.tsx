import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Calendar, Clock, Award, Search, Trash2, AlertTriangle, X, Eye, EyeOff } from 'lucide-react';
import { certificatesAPI } from '../services/api';

interface Certificate {
    id: number;
    certificateId: string;
    studentName: string;
    courseName: string;
    hours: number;
    issueDate: string;
    status: string;
    createdAt: string;
}

interface CertificateListProps {
    certificates: Certificate[];
    onRefresh: () => void;
}

const CertificateList: React.FC<CertificateListProps> = ({ certificates, onRefresh }) => {
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState<string | null>(null);

    const handleDownload = async (certificateId: string, studentName: string) => {
        try {
            const blob = await certificatesAPI.download(certificateId);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `certificado-${studentName.replace(/\s+/g, '-')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading certificate:', error);
            alert('Erro ao baixar certificado');
        }
    };

    const handleRevoke = async (certificateId: string) => {
        setIsProcessing(certificateId);
        try {
            await certificatesAPI.revoke(certificateId);
            onRefresh();
            setShowConfirm(null);
        } catch (error: any) {
            console.error('Error revoking certificate:', error);
            alert(error.response?.data?.message || 'Erro ao revogar certificado');
        } finally {
            setIsProcessing(null);
        }
    };

    const handleToggleStatus = async (certificateId: string, currentStatus: string) => {
        setIsProcessing(certificateId);
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            await certificatesAPI.updateStatus(certificateId, newStatus);
            onRefresh();
        } catch (error: any) {
            console.error('Error toggling status:', error);
            alert(error.response?.data?.message || 'Erro ao atualizar status');
        } finally {
            setIsProcessing(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    if (certificates.length === 0) {
        return (
            <div className="text-center py-12">
                <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">Nenhum certificado encontrado</p>
                <p className="text-slate-400 text-sm mt-2">Crie seu primeiro certificado para começar</p>
            </div>
        );
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'inactive':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'revoked':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return 'Ativo';
            case 'inactive': return 'Inativo';
            case 'revoked': return 'Revogado';
            default: return status;
        }
    };

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {certificates.map((cert, index) => (
                    <motion.div
                        key={cert.certificateId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="card hover:shadow-xl transition-shadow duration-300 relative overflow-hidden flex flex-col"
                    >
                        {/* Status Overlay for Revoked or Inactive */}
                        {(cert.status === 'revoked' || cert.status === 'inactive') && (
                            <div className={`absolute inset-0 pointer-events-none z-10 ${cert.status === 'revoked' ? 'bg-slate-900/5 backdrop-blur-[1px]' : 'bg-amber-900/5'}`} />
                        )}

                        <div className="p-5 flex flex-col h-full relative z-20">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className={`font-bold text-lg line-clamp-1 ${cert.status === 'revoked' ? 'text-slate-400' : cert.status === 'inactive' ? 'text-slate-600' : 'text-slate-800'}`}>
                                        {cert.studentName}
                                    </h3>
                                    <p className={`text-sm line-clamp-1 mt-1 ${cert.status === 'revoked' ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {cert.courseName}
                                    </p>
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 border ${getStatusStyles(cert.status)}`}>
                                    {getStatusLabel(cert.status)}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-2 mb-4">
                                <div className={`flex items-center gap-2 text-sm ${cert.status === 'revoked' ? 'text-slate-400' : 'text-slate-600'}`}>
                                    <Clock className={`w-4 h-4 ${cert.status === 'active' ? 'text-primary-500' : 'text-slate-400'}`} />
                                    <span>{cert.hours} horas</span>
                                </div>
                                <div className={`flex items-center gap-2 text-sm ${cert.status === 'revoked' ? 'text-slate-400' : 'text-slate-600'}`}>
                                    <Calendar className={`w-4 h-4 ${cert.status === 'active' ? 'text-primary-500' : 'text-slate-400'}`} />
                                    <span>{formatDate(cert.issueDate)}</span>
                                </div>
                            </div>

                            {/* Certificate ID */}
                            <div className={`mb-4 p-2 rounded border text-xs font-mono transition-colors ${cert.status === 'revoked'
                                ? 'bg-slate-50 border-slate-100 text-slate-400'
                                : cert.status === 'inactive'
                                    ? 'bg-amber-50/50 border-amber-100 text-amber-800/70'
                                    : 'bg-slate-50 border-slate-200 text-slate-700'
                                }`}>
                                <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5 font-sans">ID de Autenticação</p>
                                <p className="truncate">{cert.certificateId}</p>
                            </div>

                            {/* Actions */}
                            <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2">
                                <button
                                    onClick={() => handleDownload(cert.certificateId, cert.studentName)}
                                    disabled={cert.status !== 'active'}
                                    className="btn-primary flex-1 flex items-center justify-center gap-2 text-xs py-2 disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-500"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    PDF
                                </button>

                                {cert.status !== 'revoked' && (
                                    <button
                                        onClick={() => handleToggleStatus(cert.certificateId, cert.status)}
                                        disabled={isProcessing === cert.certificateId}
                                        className={`p-2 rounded-lg transition-colors border ${cert.status === 'active'
                                                ? 'text-amber-600 hover:text-amber-700 border-amber-100 hover:border-amber-200 hover:bg-amber-50'
                                                : 'text-green-600 hover:text-green-700 border-green-100 hover:border-green-200 hover:bg-green-50'
                                            }`}
                                        title={cert.status === 'active' ? 'Desativar Certificado' : 'Ativar Certificado'}
                                    >
                                        {isProcessing === cert.certificateId ? (
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : cert.status === 'active' ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                )}

                                {cert.status !== 'revoked' && (
                                    <button
                                        onClick={() => setShowConfirm(cert.certificateId)}
                                        disabled={isProcessing === cert.certificateId}
                                        className="btn-secondary text-red-600 hover:text-red-700 border-red-100 hover:border-red-200 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                        title="Revogar Certificado"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Revoke Confirmation Modal */}
            <AnimatePresence>
                {showConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isProcessing && setShowConfirm(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Revogar Certificado?</h3>
                                <p className="text-slate-600 mb-6">
                                    Esta ação é permanente. O certificado deixará de ser válido publicamente e não poderá ser baixado ou reativado.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowConfirm(null)}
                                        disabled={!!isProcessing}
                                        className="btn-secondary flex-1 py-2.5"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => handleRevoke(showConfirm)}
                                        disabled={!!isProcessing}
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl flex-1 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isProcessing === showConfirm ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            'Sim, Revogar'
                                        )}
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowConfirm(null)}
                                disabled={!!isProcessing}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CertificateList;
