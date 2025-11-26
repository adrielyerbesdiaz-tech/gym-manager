import { useState } from 'react';
import { LogIn, Lock, User } from 'lucide-react';

interface LoginPaginaProps {
    // Props actualizadas para reflejar los nombres del backend
    onLogin: (nombreUsuario: string, contrasenia: string) => boolean;
    onCancel: () => void;
}

export default function LoginPagina({ onLogin, onCancel }: LoginPaginaProps) {
    // Estados refactorizados según la entidad Usuario del backend
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [contrasenia, setContrasenia] = useState('');

    const [error, setError] = useState('');
    const [procesando, setProcesando] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setProcesando(true);

        // Simular validación
        setTimeout(() => {
            const success = onLogin(nombreUsuario, contrasenia);

            if (!success) {
                setError('Usuario o contraseña incorrectos');
                setProcesando(false);
            }
            // Si tiene éxito, el componente padre manejará la navegación
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full mb-4 shadow-lg shadow-red-500/30">
                        <Lock className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Sesión</h1>
                    <p className="text-gray-600">Acceso al panel de administración</p>
                </div>

                {/* Card de Login */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Usuario */}
                        <div>
                            <label htmlFor="nombreUsuario" className="block text-sm font-medium text-gray-700 mb-2">
                                Usuario
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    id="nombreUsuario"
                                    value={nombreUsuario}
                                    onChange={(e) => setNombreUsuario(e.target.value)}
                                    placeholder="Ingrese su usuario"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                    disabled={procesando}
                                    required
                                />
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label htmlFor="contrasenia" className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    id="contrasenia"
                                    value={contrasenia}
                                    onChange={(e) => setContrasenia(e.target.value)}
                                    placeholder="Ingrese su contraseña"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                    disabled={procesando}
                                    required
                                />
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Botones */}
                        <div className="space-y-3">
                            <button
                                type="submit"
                                disabled={procesando}
                                className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-red-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
                            >
                                {procesando ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Verificando...</span>
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5" />
                                        <span>Ingresar</span>
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={procesando}
                                className="w-full border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>

                    {/* Información de demo */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-800 text-center">
                            <strong>Demo:</strong> Usuario: <code className="bg-blue-100 px-1 rounded">admin</code> | Contraseña: <code className="bg-blue-100 px-1 rounded">admin123</code>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}