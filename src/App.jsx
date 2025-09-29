import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext.jsx';

// Importação dos componentes de página e UI
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomeScreen.jsx';
import AuthPage from './pages/AuthPage.jsx';
import CartView from './pages/CartView.jsx';

const API_BASE_URL = 'http://localhost:3000/api';

export default function App() {
    const { user, token, loading } = useAuth();
    const [currentPage, setCurrentPage] = useState('home');
    const [cartItems, setCartItems] = useState([]);
    
    // Se o AuthContext ainda estiver carregando os dados, mostra uma tela de "Carregando"
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
    }

    // Se não há usuário logado, força a exibição da página de autenticação
    if (!user || !token) {
        return <AuthPage />;
    }
    
    // Lógica para buscar e gerenciar o carrinho (só executa se o usuário está logado)
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/carrinho`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) throw new Error('Falha ao buscar carrinho');
                const data = await response.json();
                setCartItems(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Erro ao buscar carrinho:", error);
                setCartItems([]);
            }
        };
        fetchCart();
    }, [token]);

    const handleAddToCart = async (productId) => {
        await fetch(`${API_BASE_URL}/carrinho/adicionar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ id_produto: productId, quantidade: 1 }),
        });
        // Atualiza a lista de itens do carrinho após adicionar
        const response = await fetch(`${API_BASE_URL}/carrinho`, { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await response.json();
        setCartItems(Array.isArray(data) ? data : []);
    };
    
    const handleRemoveFromCart = async (productId) => {
        await fetch(`${API_BASE_URL}/carrinho/remover/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        // Atualiza a lista de itens do carrinho após remover
        const response = await fetch(`${API_BASE_URL}/carrinho`, { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await response.json();
        setCartItems(Array.isArray(data) ? data : []);
    };

    const onNavigate = (page) => setCurrentPage(page);

    const renderPage = () => {
        switch (currentPage) {
            case 'cart':
                return <CartView cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} onNavigate={onNavigate} />;
            default: // 'home'
                return <HomePage onAddToCart={handleAddToCart} />;
        }
    };

    const cartItemCount = cartItems.reduce((sum, item) => sum + (item.quantidade || 0), 0);

    // Renderiza a loja completa se o usuário está logado
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header onNavigate={onNavigate} cartItemCount={cartItemCount} />
            <main className="flex-grow">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
}
