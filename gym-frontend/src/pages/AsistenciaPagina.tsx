import { useState } from 'react';
import { Dumbbell, CheckCircle, UserCheck, LogIn } from 'lucide-react';
import { AsistenciaApi } from '../api/rutas/ApiAsistencia';
import { ClienteApi } from '../api/rutas/ApiCliente';

interface AsistenciaPaginaProps {
    onLoginClick?: () => void;
    onRegisterAttendance?: (clienteId: number, clienteName: string) => Promise<boolean>;
}

export default function AsistenciaPagina({ onLoginClick, onRegisterAttendance }: AsistenciaPaginaProps = {}) {
    const [memberId, setMemberId] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [memberName, setMemberName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId.trim()) return;

    setIsProcessing(true);
    setError('');
    
    try {
        // 1. Buscar cliente por teléfono exacto
        const cliente = await ClienteApi.buscarClientePorTelefono(memberId.trim());
        
        if (!cliente) {
            throw new Error('Cliente no encontrado. Verifique el teléfono.');
        }

        // 2. Verificar si ya registró asistencia hoy
        const yaRegistro = await AsistenciaApi.verificarAsistenciaHoy(cliente.id);
        
        if (yaRegistro) {
            throw new Error(`${cliente.nombreCompleto} ya registró su asistencia hoy.`);
        }

        // 3. Registrar asistencia (usando la función de App.tsx si está disponible)
        let registroExitoso = false;
        
        if (onRegisterAttendance) {
            registroExitoso = await onRegisterAttendance(cliente.id, cliente.nombreCompleto);
        } else {
            // Fallback: registrar directamente
            await AsistenciaApi.registrarAsistencia(cliente.id);
            registroExitoso = true;
        }

        if (registroExitoso) {
            // 4. Mostrar éxito
            setMemberName(cliente.nombreCompleto);
            setIsRegistered(true);

            // 5. Resetear después de 3 segundos
            setTimeout(() => {
                setIsRegistered(false);
                setMemberId('');
                setMemberName('');
            }, 3000);
        }

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al registrar asistencia.';
        setError(errorMessage);
    } finally {
        setIsProcessing(false);
    }
};

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo y Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full mb-4 shadow-lg shadow-red-500/30">
                        <Dumbbell className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">NOR-YAM FITNESS GIMNASIO</h1>
                    <p className="text-gray-600">Registro de Asistencia</p>
                </div>

                {/* Card Principal */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                    {!isRegistered ? (
                        <>
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center justify-center gap-2">
                                    <UserCheck className="w-5 h-5 text-red-500" />
                                    Bienvenido
                                </h2>
                                <p className="text-gray-600 text-sm text-center">
                                    Ingrese su teléfono para registrar su asistencia
                                </p>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="memberId" className="block text-sm font-medium text-gray-700 mb-2">
                                        Teléfono
                                    </label>
                                    <input
                                        type="text"
                                        id="memberId"
                                        value={memberId}
                                        onChange={(e) => setMemberId(e.target.value)}
                                        placeholder="Ej: 1234567890"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                        disabled={isProcessing}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isProcessing || !memberId.trim()}
                                    className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-red-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Procesando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <UserCheck className="w-5 h-5" />
                                            <span>Registrar Asistencia</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                ¡Asistencia Registrada!
                            </h3>
                            <p className="text-gray-600 mb-1">
                                Bienvenido, {memberName}
                            </p>
                            <p className="text-sm text-gray-500">
                                {new Date().toLocaleString('es-MX', {
                                    dateStyle: 'long',
                                    timeStyle: 'short'
                                })}
                            </p>
                            <div className="mt-6">
                                <p className="text-green-600 font-semibold">
                                    ¡Que tengas un excelente entrenamiento! 💪
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Login Button - Solo visible si hay callback de login */}
                {onLoginClick && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={onLoginClick}
                            className="inline-flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-red-500 hover:text-red-600 transition-all duration-200 shadow-sm"
                        >
                            <LogIn className="w-4 h-4" />
                            <span className="font-medium">Iniciar Sesión (Administrador)</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}