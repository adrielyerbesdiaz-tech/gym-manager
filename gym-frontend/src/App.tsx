import React, { useState } from 'react';

export default function GymLogin() {
  const [searchValue, setSearchValue] = useState('');

  const handleRegister = () => {
    console.log('Registrar clicked');
    // Aquí puedes agregar la lógica de registro
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-purple-500 to-purple-800">
      <div className="bg-white bg-opacity-95 p-12 rounded-3xl shadow-2xl max-w-md w-full text-center">
        <div className="text-6xl mb-3">💪</div>
        
        <h1 className="text-gray-800 text-4xl font-bold mb-3">
          ¡Bienvenido!
        </h1>
        
        <p className="text-gray-600 mb-10 text-base">
          Prepárate para entrenar
        </p>
        
        <div className="relative mb-8">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
            🔍
          </span>
          <input
            type="text"
            value={searchValue}
            onChange={handleSearch}
            placeholder="Buscar..."
            className="w-full py-4 px-5 pl-14 border-2 border-gray-200 rounded-full text-base outline-none transition-all duration-300 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-100"
          />
        </div>
        
        <button
          onClick={handleRegister}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full text-lg font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-purple-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-400 active:translate-y-0"
        >
          Registrar
        </button>
        
        <p className="mt-6 text-gray-500 text-sm">
          ¿Ya tienes cuenta?{' '}
          <a href="#" className="text-purple-500 font-semibold no-underline hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}