import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-600 group-hover:text-pink-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export default function Header({ onNavigate, cartItemCount }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      <h1
        className="text-3xl font-extrabold text-pink-600 cursor-pointer tracking-tighter"
        onClick={() => onNavigate('home')}
      >
        Festa & Cia
      </h1>
      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <span className="text-gray-700 hidden sm:block font-medium">Olá, {user.nome.split(' ')[0]}!</span>
            <button onClick={() => onNavigate('cart')} className="relative group" aria-label="Ver carrinho">
              <CartIcon />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button onClick={handleLogout} className="bg-pink-500 text-white px-5 py-2 rounded-full hover:bg-pink-600 transition-colors font-semibold shadow-md hover:shadow-lg">
              Sair
            </button>
          </>
        ) : (
          <button onClick={() => onNavigate('auth')} className="bg-pink-500 text-white px-5 py-2 rounded-full hover:bg-pink-600 transition-colors font-semibold shadow-md hover:shadow-lg">
            Entrar / Registrar
          </button>
        )}
      </div>
    </header>
  );
}

