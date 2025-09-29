import React from 'react';

// Ícone da lixeira para o botão de remover
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

export default function CartView({ cartItems = [], onRemoveFromCart, onNavigate }) {
    // Calcula o valor total do carrinho
    const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.preco_unitario) * item.quantidade), 0);

    // Função para confirmar a remoção de um item
    const handleRemove = (itemId, itemName) => {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Tem certeza?',
                text: `Deseja remover ${itemName} do carrinho?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sim, remover!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    onRemoveFromCart(itemId);
                    Swal.fire('Removido!', 'O item foi removido do seu carrinho.', 'success');
                }
            });
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-8 max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Seu Carrinho de Compras</h2>
            
            {/* Se o carrinho estiver vazio */}
            {cartItems.length === 0 ? (
                <div className="text-center bg-white p-10 rounded-lg shadow-md">
                    <p className="text-gray-600 text-xl mb-6">Seu carrinho está vazio.</p>
                    <button 
                        onClick={() => onNavigate('home')} 
                        className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition-colors font-semibold shadow hover:shadow-lg"
                    >
                        Ver produtos
                    </button>
                </div>
            ) : (
                // Se houver itens no carrinho
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <ul className="divide-y divide-gray-200">
                        {cartItems.map(item => (
                            <li key={item.id_produto} className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800">{item.nome}</h4>
                                    <p className="text-gray-600">
                                        Quantidade: {item.quantidade} x R$ {parseFloat(item.preco_unitario).toFixed(2).replace('.', ',')}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                                    <span className="font-bold text-gray-800 text-lg">
                                        R$ {(parseFloat(item.preco_unitario) * item.quantidade).toFixed(2).replace('.', ',')}
                                    </span>
                                    <button 
                                        onClick={() => handleRemove(item.id_produto, item.nome)} 
                                        className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-gray-100"
                                        aria-label={`Remover ${item.nome}`}
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-800">Total:</span>
                        <span className="text-2xl font-bold text-pink-600">
                            R$ {total.toFixed(2).replace('.', ',')}
                        </span>
                    </div>
                    <button className="w-full mt-6 bg-green-500 text-white text-lg px-6 py-3 rounded-full hover:bg-green-600 transition-colors font-semibold shadow hover:shadow-lg">
                        Finalizar Compra
                    </button>
                </div>
            )}
        </div>
    );
}

