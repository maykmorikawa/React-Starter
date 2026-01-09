import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, LogOut, Award, Search, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { certificatesAPI } from '../services/api';
import CertificateForm from '../components/CertificateForm';
import CertificateList from '../components/CertificateList';

interface Certificate {
    _id: string;
    certificateId: string;
    studentName: string;
    courseName: string;
    hours: number;
    issueDate: string;
    status: string;
    createdAt: string;
}

const AdminDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchCertificates = async () => {
        setIsLoading(true);
        try {
            const response = await certificatesAPI.getAll(page, 50, searchTerm);
            setCertificates(response.certificates);
            setTotalPages(response.pagination.pages);
        } catch (error) {
            console.error('Error fetching certificates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, [page, searchTerm]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gradient flex items-center gap-3">
                                <Award className="w-8 h-8 text-primary-600" />
                                Painel Administrativo
                            </h1>
                            <p className="text-slate-600 mt-2">
                                Bem-vindo, <span className="font-semibold">{user?.username}</span>
                            </p>
                        </div>

                        <button
                            onClick={logout}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <LogOut className="w-5 h-5" />
                            Sair
                        </button>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
                >
                    <div className="card">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600">Total</p>
                                    <p className="text-3xl font-bold text-primary-600 mt-2">
                                        {certificates.length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                    <Award className="w-6 h-6 text-primary-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card border-l-4 border-green-500">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600">Ativos</p>
                                    <p className="text-3xl font-bold text-green-600 mt-2">
                                        {certificates.filter(c => c.status === 'active').length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <Award className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card border-l-4 border-amber-500">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600">Inativos</p>
                                    <p className="text-3xl font-bold text-amber-600 mt-2">
                                        {certificates.filter(c => c.status === 'inactive').length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                    <Award className="w-6 h-6 text-amber-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card border-l-4 border-red-500">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600">Revogados</p>
                                    <p className="text-3xl font-bold text-red-600 mt-2">
                                        {certificates.filter(c => c.status === 'revoked').length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <Award className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card mb-6"
                >
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    placeholder="Buscar por nome, curso ou ID..."
                                    className="input-field pl-10 w-full"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={fetchCertificates}
                                    className="btn-secondary flex items-center gap-2"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    Atualizar
                                </button>

                                <button
                                    onClick={() => setShowForm(true)}
                                    className="btn-primary flex items-center gap-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    Novo Certificado
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Certificate List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : (
                        <CertificateList
                            certificates={certificates}
                            onRefresh={fetchCertificates}
                        />
                    )}
                </motion.div>

                {/* Form Modal */}
                {showForm && (
                    <CertificateForm
                        onClose={() => setShowForm(false)}
                        onSuccess={fetchCertificates}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
