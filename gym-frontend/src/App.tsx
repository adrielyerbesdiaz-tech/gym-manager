import { useState, useEffect, useCallback } from 'react';
import AsistenciaPagina from './pages/asistencias/AsistenciaPagina';
import ClientesPagina from './pages/clientes/ClientesPagina';
import ConfiguracionesPagina from './pages/configuraciones/ConfiguracionesPagina';
import FinanzasPagina from './pages/finanzas/FinanzasPagina';
import EquipamientoPagina from './pages/equipamiento/EquipamientoPagina';
import LoginPagina from './pages/login/LoginPagina';
import { LogOut, Dumbbell, Users, Settings, DollarSign, Wrench } from 'lucide-react';
import type { IAsistencia } from './models/IAsistencia';
import type { IMembresia } from './models/IMembresia';
import type { ITipoMembresia } from './models/ITipoMembresia';
import type { ICliente } from './models/ICliente';
import type { IPago } from './models/IPago';
import type { IEquipamiento } from './models/IEquipamiento';
import type { IEquipoAccesorio } from './models/IEquipoAccesorio';
import type { IMantenimiento } from './models/IMantenimiento';

import { ApiCliente } from './api/clientes/ApiCliente';
import { ApiTipoMembresia } from './api/membresias/ApiTipoMembresia';
import { ApiAsistencia } from './api/asistencias/ApiAsistencia';
import { ApiMembresia } from './api/membresias/ApiMembresia';
import { ApiPago } from './api/pagos/ApiPago';
import { ApiEquipamiento } from './api/equipamiento/ApiEquipamiento';
import { ApiEquipoAccesorio } from './api/equipamiento/ApiEquipoAccesorio';
import { ApiMantenimiento } from './api/equipamiento/ApiMantenimiento';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [paginaActual, setPaginaActual] = useState<'asistencias' | 'clientes' | 'finanzas' | 'equipamiento' | 'configuraciones'>('asistencias');

  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estados globales
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [asistencias, setAsistencias] = useState<IAsistencia[]>([]);
  const [membresias, setMembresias] = useState<IMembresia[]>([]);
  const [tiposMembresia, setTiposMembresia] = useState<ITipoMembresia[]>([]);
  const [pagos, setPagos] = useState<IPago[]>([]);
  const [equipamiento, setEquipamiento] = useState<IEquipamiento[]>([]);
  const [accesorios, setAccesorios] = useState<IEquipoAccesorio[]>([]);
  const [mantenimientos, setMantenimientos] = useState<IMantenimiento[]>([]);

  // ==================== LÓGICA DE NAVEGACIÓN Y AUTENTICACIÓN ====================
  const handleLoginClick = () => setShowLogin(true);
  const handleCancelLogin = () => setShowLogin(false);
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPaginaActual('asistencias');
  };

  const handleLogin = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setShowLogin(false);
      setPaginaActual('clientes');
      return true;
    }
    return false;
  };

  // Función para registrar asistencia desde AsistenciaPagina
  const handleRegisterAttendance = async (clienteId: number, clienteName: string): Promise<boolean> => {
    try {
      // Verificar si ya registró hoy
      const yaRegistro = await ApiAsistencia.verificarAsistenciaHoy(clienteId);

      if (yaRegistro) {
        alert(`${clienteName} ya registró su asistencia hoy.`);
        return false;
      }

      // Registrar asistencia
      await ApiAsistencia.registrarAsistencia(clienteId);
      return true;
    } catch (error) {
      console.error('Error registrando asistencia:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      return false;
    }
  };

  // ==================== LÓGICA DE CARGA DE DATOS ====================
  const cargarDatosIniciales = useCallback(async () => {
    setLoadingError(null);
    setIsLoading(true);

    try {
      console.log('Iniciando carga de datos...');

      const [
        clientesData,
        tiposMembresiaData,
        membresiasData,
        pagosData,
        equipamientoData,
        accesoriosData,
        mantenimientosData
      ] = await Promise.all([
        ApiCliente.obtenerClientes(),
        ApiTipoMembresia.obtenerTiposMembresia(),
        ApiMembresia.obtenerMembresias(),
        ApiPago.obtenerPagos(),
        ApiEquipamiento.obtenerEquipos(),
        ApiEquipoAccesorio.obtenerAccesorios(),
        ApiMantenimiento.obtenerMantenimientos()
      ]);

      console.log('Datos cargados exitosamente');

      setClientes(clientesData);
      setTiposMembresia(tiposMembresiaData);
      setMembresias(membresiasData);
      setPagos(pagosData);
      setEquipamiento(equipamientoData);
      setAccesorios(accesoriosData);
      setMantenimientos(mantenimientosData);

      // Asistencias se cargan bajo demanda o podríamos cargar las de hoy
      // Por ahora las dejamos vacías o cargamos las de hoy si es necesario
      setAsistencias([]);

    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      setLoadingError(
        `No se pudieron cargar los datos: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatosIniciales();
  }, [cargarDatosIniciales]);

  // ==================== RENDERIZADO ====================

  // Pantalla de error de conexión
  if (loadingError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center p-8 bg-white border-2 border-red-200 rounded-lg shadow-xl max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error de Conexión</h2>
          <p className="text-gray-600 mb-4">{loadingError}</p>
          <p className="text-sm text-gray-500 mb-6">
            Asegúrate de que el servidor backend esté corriendo en http://localhost:5000
          </p>
          <button
            onClick={cargarDatosIniciales}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Reintentar Conexión
          </button>
        </div>
      </div>
    );
  }

  // Pantalla de carga
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Dumbbell className="w-16 h-16 text-red-500 animate-bounce mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando datos...</p>
        </div>
      </div>
    );
  }

  // Pantalla de login
  if (showLogin) {
    return <LoginPagina onLogin={handleLogin} onCancel={handleCancelLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      {isAuthenticated && (
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-4">
                <Dumbbell className="w-6 h-6 text-red-600" />
                <span className="text-xl font-bold text-gray-900">Gym Manager</span>

                <button
                  onClick={() => setPaginaActual('asistencias')}
                  className={`flex items-center gap-2 py-2 px-3 border-b-2 font-medium text-sm transition-colors ${paginaActual === 'asistencias'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                >
                  <Dumbbell className="w-4 h-4" />
                  Asistencias
                </button>
                <button
                  onClick={() => setPaginaActual('clientes')}
                  className={`flex items-center gap-2 py-2 px-3 border-b-2 font-medium text-sm transition-colors ${paginaActual === 'clientes'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                >
                  <Users className="w-4 h-4" />
                  Clientes
                </button>
                <button
                  onClick={() => setPaginaActual('finanzas')}
                  className={`flex items-center gap-2 py-2 px-3 border-b-2 font-medium text-sm transition-colors ${paginaActual === 'finanzas'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                >
                  <DollarSign className="w-4 h-4" />
                  Finanzas
                </button>
                <button
                  onClick={() => setPaginaActual('equipamiento')}
                  className={`flex items-center gap-2 py-2 px-3 border-b-2 font-medium text-sm transition-colors ${paginaActual === 'equipamiento'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                >
                  <Wrench className="w-4 h-4" />
                  Equipamiento
                </button>
                <button
                  onClick={() => setPaginaActual('configuraciones')}
                  className={`flex items-center gap-2 py-2 px-3 border-b-2 font-medium text-sm transition-colors ${paginaActual === 'configuraciones'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                >
                  <Settings className="w-4 h-4" />
                  Configuraciones
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Page Content */}
      <main className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-6">
        {isAuthenticated ? (
          paginaActual === 'asistencias' ? (
            <AsistenciaPagina
              onLoginClick={handleLoginClick}
              onRegisterAttendance={handleRegisterAttendance}
            />
          ) : paginaActual === 'clientes' ? (
            <ClientesPagina
              clientes={clientes}
              setClientes={setClientes}
              asistencias={asistencias}
              membresias={membresias}
              setMembresias={setMembresias}
              tiposMembresia={tiposMembresia}
              pagos={pagos}
              setPagos={setPagos}
            />
          ) : paginaActual === 'finanzas' ? (
            <FinanzasPagina
              pagos={pagos}
              setPagos={setPagos}
              mantenimientos={mantenimientos}
              membresias={membresias}
              equipamiento={equipamiento}
              clientes={clientes}
              tiposMembresia={tiposMembresia}
            />
          ) : paginaActual === 'equipamiento' ? (
            <EquipamientoPagina
              equipamiento={equipamiento}
              setEquipamiento={setEquipamiento}
              accesorios={accesorios}
              setAccesorios={setAccesorios}
              mantenimientos={mantenimientos}
              setMantenimientos={setMantenimientos}
            />
          ) : (
            <ConfiguracionesPagina
              tiposMembresia={tiposMembresia}
              setTiposMembresia={setTiposMembresia}
            />
          )
        ) : (
          <AsistenciaPagina
            onLoginClick={handleLoginClick}
            onRegisterAttendance={handleRegisterAttendance}
          />
        )}
      </main>
    </div>
  );
}

export default App;