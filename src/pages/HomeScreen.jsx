import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3000/api';

function ProductCard({ product, onAddToCart }) {
    const handleAddToCartClick = () => {
        onAddToCart(product.id, 1);
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: `${product.nome} adicionado ao carrinho!`,
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col group">
            <div className="relative h-56 bg-gray-200 flex items-center justify-center overflow-hidden">
                <span className="text-gray-400">[Imagem do Produto]</span>
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">{product.nome}</h3>
                <p className="text-gray-600 mb-4 flex-grow text-sm">{product.descricao}</p>
                <div className="flex justify-between items-center mt-auto">
                    <span className="text-2xl font-bold text-pink-600">R$ {parseFloat(product.preco).toFixed(2).replace('.', ',')}</span>
                    <button
                        onClick={handleAddToCartClick}
                        className="bg-pink-500 text-white px-5 py-2 rounded-full hover:bg-pink-600 transition-colors font-semibold shadow-md group-hover:shadow-lg"
                    >
                        Adicionar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function HomePage({ onAddToCart }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/produtos`);
                if (!response.ok) {
                    throw new Error(`A resposta da API falhou: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError("Não foi possível carregar os produtos. Verifique se a API está online.");
                console.error("Falha ao buscar produtos:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return <div className="text-center p-10">Carregando produtos...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4 sm:p-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Nossos Produtos</h2>
            {products.length === 0 ? (
                <p className="text-center text-gray-500">Nenhum produto encontrado.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                    ))}
                </div>
            )}
        </div>
    );
}