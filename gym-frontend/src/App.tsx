import { useState, useEffect } from 'react';
import { Dumbbell, UserCheck, Search } from 'lucide-react';
import { buscarClientes } from './api/ClienteApi';
import type { Cliente } from './api/ClienteApi';

export default function AsistenciaPagina() {
    const [searchText, setSearchText] = useState('');
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Buscar clientes mientras el usuario escribe
    useEffect(() => {
        const buscar = async () => {
            if (searchText.trim() === '') {
                setClientes([]);
                setShowDropdown(false);
                return;
            }

            setIsLoading(true);
            try {
                const resultados = await buscarClientes(searchText);
                setClientes(resultados);
                setShowDropdown(resultados.length > 0);
            } catch (error) {
                console.error('Error:', error);
                setClientes([]);
            } finally {
                setIsLoading(false);
            }
        };

        // Debounce: esperar 300ms después de que el usuario deje de escribir
        const timer = setTimeout(buscar, 300);
        return () => clearTimeout(timer);
    }, [searchText]);

    const handleSelectCliente = (cliente: Cliente) => {
        setSelectedCliente(cliente);
        setSearchText(cliente.nombreCompleto);
        setShowDropdown(false);
    };

    const handleClear = () => {
        setSearchText('');
        setSelectedCliente(null);
        setClientes([]);
        setShowDropdown(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo y Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full mb-4 shadow-lg shadow-red-500/30">
                        <Dumbbell className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">NORK-YAM FITNESS GYM</h1>
                    <p className="text-gray-600">Registro de Asistencia</p>
                </div>

                {/* Card Principal */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Bienvenido
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Busca tu nombre, teléfono o ID
                        </p>
                    </div>

                    {/* Buscador con Autocomplete */}
                    <div className="relative">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                            ¿Quién eres?
                        </label>
                        
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            
                            <input
                                type="text"
                                id="search"
                                value={searchText}
                                onChange={(e) => {
                                    setSearchText(e.target.value);
                                    setSelectedCliente(null);
                                }}
                                placeholder="Buscar por nombre, teléfono o ID..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                            />

                            {/* Indicador de carga */}
                            {isLoading && (
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}

                            {/* Checkmark cuando se selecciona */}
                            {selectedCliente && (
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <UserCheck className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Dropdown de resultados */}
                        {showDropdown && !selectedCliente && (
                            <div className="absolute w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto z-10">
                                {clientes.map((cliente) => (
                                    <div
                                        key={cliente.Id}
                                        onClick={() => handleSelectCliente(cliente)}
                                        className="px-4 py-3 hover:bg-red-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="font-medium text-gray-900">
                                            {cliente.nombreCompleto}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Tel: {cliente.telefono} • ID: {cliente.Id}
                                        </div>
                                        {cliente.notas && (
                                            <div className="text-xs text-gray-400 mt-1">
                                                {cliente.notas}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Información del cliente seleccionado */}
                    {selectedCliente && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Cliente seleccionado:
                            </h3>
                            <p className="text-gray-700">
                                <span className="font-medium">Nombre:</span> {selectedCliente.nombreCompleto}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-medium">Teléfono:</span> {selectedCliente.telefono}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-medium">ID:</span> {selectedCliente.Id}
                            </p>
                            
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={handleClear}
                                    className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Buscar otro
                                </button>
                                <button
                                    disabled
                                    className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold py-2 px-4 rounded-lg opacity-50 cursor-not-allowed"
                                >
                                    Registrar (Próximamente)
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Mensaje cuando no hay resultados */}
                    {searchText.trim() && !isLoading && clientes.length === 0 && !selectedCliente && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-800 text-sm">
                                No se encontraron clientes con "{searchText}"
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}