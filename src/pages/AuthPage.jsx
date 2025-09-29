import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import './AuthPage.css';

const API_BASE_URL = 'http://localhost:3000/api';

// Componente interno para o formulário
function AuthForm({ isLogin, handleAuthSubmit, loading }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const endpoint = isLogin ? 'login' : 'registrar';
        const payload = isLogin ? { email, senha } : { nome, email, senha };
        handleAuthSubmit(endpoint, payload);
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
                <div className="input-group">
                    <div className="input-icon">👤</div>
                    <input 
                        type="text" 
                        value={nome} 
                        onChange={e => setNome(e.target.value)} 
                        required 
                        className="auth-input" 
                        placeholder="Nome Completo"
                    />
                </div>
            )}
            <div className="input-group">
                <div className="input-icon">✉️</div>
                <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    className="auth-input" 
                    placeholder="Seu melhor email"
                />
            </div>
            <div className="input-group">
                <div className="input-icon">🔒</div>
                <input 
                    type="password" 
                    value={senha} 
                    onChange={e => setSenha(e.target.value)} 
                    required 
                    className="auth-input" 
                    placeholder="Sua senha secreta"
                />
            </div>
            <button type="submit" disabled={loading} className="auth-button">
                {loading ? (
                    <div className="button-loading">
                        <div className="spinner"></div>
                        Processando...
                    </div>
                ) : (
                    isLogin ? 'Entrar na Conta' : 'Criar Minha Conta'
                )}
            </button>
        </form>
    );
}

export default function AuthPage() {
    const [isLoginView, setIsLoginView] = useState(true);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleAuth = async (endpoint, payload) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Ocorreu um erro.');
            }

            if (endpoint === 'login') {
                login(data.user, data.token);
                if (typeof Swal !== 'undefined') Swal.fire({ 
                    icon: 'success', 
                    title: 'Login realizado!', 
                    showConfirmButton: false, 
                    timer: 1500 
                });
            } else {
                if (typeof Swal !== 'undefined') Swal.fire({ 
                    icon: 'success', 
                    title: 'Conta criada com sucesso!', 
                    text: 'Agora você pode fazer o login.' 
                });
                setIsLoginView(true);
            }
        } catch (err) {
            if (typeof Swal !== 'undefined') Swal.fire({ 
                icon: 'error', 
                title: 'Oops...', 
                text: err.message 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-layout">
                {/* Painel Esquerdo - Decorativo */}
                <div className="auth-panel-left">
                    <div className="panel-content">
                        <div className="logo-container">
                            <div className="logo-icon">🎉</div>
                            <h1 className="panel-title">Samambaia Festas</h1>
                        </div>
                        <p className="panel-subtitle">
                            Sua festa começa aqui. Os melhores artigos com os melhores preços.
                        </p>
                        <div className="feature-list">
                            <div className="feature-item">
                                <span className="feature-icon">🚚</span>
                                <span>Entrega rápida</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">💳</span>
                                <span>Pagamento seguro</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">⭐</span>
                                <span>Produtos premium</span>
                            </div>
                        </div>
                    </div>
                    <div className="panel-background"></div>
                </div>

                {/* Painel Direito - Formulário */}
                <div className="auth-panel-right">
                    <div className="auth-card">
                        <div className="auth-header">
                            <h2 className="auth-card-title">
                                {isLoginView ? 'Bem-vindo(a) de volta!' : 'Junte-se a nós'}
                            </h2>
                            <p className="auth-card-subtitle">
                                {isLoginView ? 'Entre em sua conta para continuar' : 'Crie sua conta em segundos'}
                            </p>
                        </div>
                        
                        <AuthForm 
                            isLogin={isLoginView} 
                            handleAuthSubmit={handleAuth} 
                            loading={loading} 
                        />

                        <div className="auth-divider">
                            <span>ou</span>
                        </div>

                        <p className="auth-toggle-text">
                            {isLoginView ? "Novo por aqui?" : "Já tem uma conta?"}
                            <button 
                                onClick={() => setIsLoginView(!isLoginView)} 
                                className="auth-toggle-button"
                            >
                                {isLoginView ? "Criar uma conta" : "Fazer login"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}