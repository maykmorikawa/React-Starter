import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Lock, User, AlertCircle, UserPlus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            if (isRegistering) {
                const response = await register(username, password);
                setSuccess('Conta criada com sucesso!');

                // Redirect based on role (defaults to 'user' for new accounts)
                if (response?.user?.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/validar');
                }
            } else {
                const response = await login(username, password);

                // Redirect based on role
                if (response?.user?.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/validar');
                }
            }
        } catch (err: any) {
            console.error('Login/Register error:', err);
            let errorMessage = err.message || (isRegistering ? 'Erro ao criar conta' : 'Erro ao fazer login');

            // Handle network errors (server down)
            if (err.code === 'ERR_NETWORK' || errorMessage === 'Network Error') {
                errorMessage = 'Erro de conexão: Verifique se o servidor backend está rodando em http://localhost:5000';
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsRegistering(!isRegistering);
        setError('');
        setSuccess('');
        setUsername('');
        setPassword('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="card">
                    {/* Header */}
                    <div className="card-header text-center">
                        <motion.div
                            key={isRegistering ? 'register' : 'login'}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isRegistering ? 'bg-green-600' : 'bg-primary-600'}`}
                        >
                            {isRegistering ? (
                                <UserPlus className="w-8 h-8 text-white" />
                            ) : (
                                <Lock className="w-8 h-8 text-white" />
                            )}
                        </motion.div>
                        <h1 className="text-2xl font-bold text-gradient">Sistema de Certificados</h1>
                        <p className="text-sm text-slate-600 mt-2">
                            {isRegistering ? 'Criar Nova Conta' : 'Acesso Administrativo'}
                        </p>
                    </div>

                    {/* Body */}
                    <div className="card-body">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm">{error}</span>
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700"
                            >
                                <UserPlus className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm">{success}</span>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Username */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                                    Usuário
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="input-field pl-10"
                                        placeholder="Digite seu usuário"
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                    Senha
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-field pl-10"
                                        placeholder="Digite sua senha"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`btn-primary w-full flex items-center justify-center gap-2 ${isRegistering ? '!bg-green-600 hover:!bg-green-700' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>{isRegistering ? 'Criando conta...' : 'Entrando...'}</span>
                                    </>
                                ) : (
                                    <>
                                        {isRegistering ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                                        <span>{isRegistering ? 'Cadastrar' : 'Entrar'}</span>
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Toggle Button */}
                        <div className="mt-6 text-center">
                            <button
                                onClick={toggleMode}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline flex items-center justify-center gap-1 mx-auto"
                            >
                                {isRegistering ? (
                                    <>
                                        <ArrowLeft className="w-4 h-4" />
                                        Voltar para Login
                                    </>
                                ) : (
                                    <>
                                        Não tem uma conta? <span className="font-bold">Cadastre-se</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Info removed for security */}
                    </div>
                </div>

                {/* Footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-sm text-slate-500 mt-6"
                >
                    Sistema de Geração e Validação de Certificados
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Login;
