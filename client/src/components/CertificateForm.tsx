import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { certificatesAPI } from '../services/api';

interface CertificateFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

const CertificateForm: React.FC<CertificateFormProps> = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        studentName: '',
        courseName: '',
        hours: '',
        issueDate: new Date().toISOString().split('T')[0],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await certificatesAPI.create({
                ...formData,
                hours: parseInt(formData.hours),
            });

            setSuccess(true);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao criar certificado');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="card w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="card-header flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Plus className="w-6 h-6 text-primary-600" />
                        <h2 className="text-xl font-bold text-slate-800">Novo Certificado</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                {/* Body */}
                <div className="card-body">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">Certificado criado com sucesso!</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Student Name */}
                        <div>
                            <label htmlFor="studentName" className="block text-sm font-medium text-slate-700 mb-2">
                                Nome do Aluno *
                            </label>
                            <input
                                id="studentName"
                                name="studentName"
                                type="text"
                                value={formData.studentName}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Ex: João Silva"
                                required
                            />
                        </div>

                        {/* Course Name */}
                        <div>
                            <label htmlFor="courseName" className="block text-sm font-medium text-slate-700 mb-2">
                                Nome do Curso *
                            </label>
                            <input
                                id="courseName"
                                name="courseName"
                                type="text"
                                value={formData.courseName}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Ex: Desenvolvimento Web com React"
                                required
                            />
                        </div>

                        {/* Hours and Date */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="hours" className="block text-sm font-medium text-slate-700 mb-2">
                                    Carga Horária *
                                </label>
                                <input
                                    id="hours"
                                    name="hours"
                                    type="number"
                                    min="1"
                                    value={formData.hours}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="40"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="issueDate" className="block text-sm font-medium text-slate-700 mb-2">
                                    Data de Emissão *
                                </label>
                                <input
                                    id="issueDate"
                                    name="issueDate"
                                    type="date"
                                    value={formData.issueDate}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn-secondary flex-1"
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn-primary flex-1"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Criando...
                                    </span>
                                ) : (
                                    'Criar Certificado'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CertificateForm;
