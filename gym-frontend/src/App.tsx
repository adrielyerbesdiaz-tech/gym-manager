import { useState } from 'react';
import AsistenciaPagina from './pages/asistencias/AsistenciaPagina';
import ClientesPagina from './pages/clientes/ClientesPagina';
import EquipamientoPagina from './pages/equipamiento/EquipamientoPagina';
import FinanzasPagina from './pages/finanzas/FinanzasPagina';
import ConfiguracionesPagina from './pages/configuraciones/ConfiguracionesPagina';
import LoginPagina from './pages/login/LoginPagina';
import { LogOut } from 'lucide-react';
import type { IAsistencia } from './models/IAsistencia';
import type { IMembresia } from './models/IMembresia';
import type { ITipoMembresia } from './models/ITipoMembresia';
import type { ICliente } from './models/ICliente';
import type { IEquipamiento } from './models/IEquipamiento';
import type { IEquipoAccesorio } from './models/IEquipoAccesorio';
import type { IMantenimiento } from './models/IMantenimiento';
import type { IPago } from './models/IPago';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [paginaActual, setPaginaActual] = useState<'asistencias' | 'clientes' | 'equipamiento' | 'finanzas' | 'configuraciones'>('asistencias');

  // Estado de contraseña (hardcoded para demo)
  const [currentPassword, setCurrentPassword] = useState('admin123');

  // Estado global para clientes
  const [clientes, setClientes] = useState<ICliente[]>([
    {
      id: 1,
      nombreCompleto: 'Juan Pérez',
      telefono: '9999026122',
      idTipoMembresia: 1,
      fechaRegistro: '2024-01-15',
      notas: 'Cliente regular, prefiere turno matutino'
    },
    {
      id: 2,
      nombreCompleto: 'María González',
      telefono: '9991234567',
      idTipoMembresia: 2,
      fechaRegistro: '2024-02-20',
      notas: 'Pago pendiente de mensualidad'
    }
  ]);

  // Tipos de membresía (ahora editable)
  const [tiposMembresia, setTiposMembresia] = useState<ITipoMembresia[]>([
    { tipoMembresiaId: 1, nombre: 'Mensual', duracionDias: 30, precio: 500 },
    { tipoMembresiaId: 2, nombre: 'Trimestral', duracionDias: 90, precio: 1350 },
    { tipoMembresiaId: 3, nombre: 'Semestral', duracionDias: 180, precio: 2500 },
    { tipoMembresiaId: 4, nombre: 'Anual', duracionDias: 365, precio: 4500 }
  ]);

  // Membresías
  const [membresias, setMembresias] = useState<IMembresia[]>([
    {
      membresiaId: 1,
      tipoMembresiaId: 1,
      clienteId: 1,
      fechaInicio: '2024-11-01',
      tipoMembresia: tiposMembresia[0],
      cliente: clientes[0],
      estado: 'Activa'
    },
    {
      membresiaId: 2,
      tipoMembresiaId: 2,
      clienteId: 2,
      fechaInicio: '2024-10-15',
      tipoMembresia: tiposMembresia[1],
      cliente: clientes[1],
      estado: 'Vencida'
    }
  ]);

  // Asistencias
  const [asistencias, setAsistencias] = useState<IAsistencia[]>([
    { asistenciaId: 1, membresiaId: 1, fechaCheckIn: '2024-11-20T08:30:00' },
    { asistenciaId: 2, membresiaId: 1, fechaCheckIn: '2024-11-21T09:15:00' },
    { asistenciaId: 3, membresiaId: 2, fechaCheckIn: '2024-11-22T10:00:00' }
  ]);

  // Equipamiento
  const [equipamiento, setEquipamiento] = useState<IEquipamiento[]>([
    {
      equipoId: 1,
      nombre: 'Barra Olímpica 20kg',
      tipo: 'Pesas libres',
      imagenUrl: '',
      descripcion: 'Barra olímpica estándar de 20kg para levantamiento de pesas'
    },
    {
      equipoId: 2,
      nombre: 'Caminadora Profesional',
      tipo: 'Cardio',
      imagenUrl: '',
      descripcion: 'Caminadora con velocidad variable y monitor de ritmo cardíaco'
    }
  ]);

  // Accesorios
  const [accesorios, setAccesorios] = useState<IEquipoAccesorio[]>([
    {
      accesorioId: 1,
      nombre: 'Mancuernas 5kg',
      cantidad: '10 pares',
      notas: 'En buen estado'
    },
    {
      accesorioId: 2,
      nombre: 'Bandas de resistencia',
      cantidad: '15 unidades',
      notas: 'Diferentes niveles de resistencia'
    }
  ]);

  // Mantenimientos
  const [mantenimientos, setMantenimientos] = useState<IMantenimiento[]>([
    {
      mantenimientoId: 1,
      equipoId: 1,
      descripcion: 'Lubricación de rodamientos y ajuste general',
      fechaInicio: '2024-11-01',
      fechaFin: '2024-11-01',
      costo: 150.00
    },
    {
      mantenimientoId: 2,
      equipoId: 2,
      descripcion: 'Revisión de motor y calibración de sensores',
      fechaInicio: '2024-11-15',
      fechaFin: null,
      costo: 300.00
    }
  ]);

  // Pagos (Ingresos)
  const [pagos, setPagos] = useState<IPago[]>([
    {
      pagoId: 1,
      membresiaId: 1,
      monto: 500.00,
      fechaPago: '2024-11-05'
    },
    {
      pagoId: 2,
      membresiaId: 2,
      monto: 1350.00,
      fechaPago: '2024-10-20'
    },
    {
      pagoId: 3,
      membresiaId: 1,
      monto: 500.00,
      fechaPago: '2024-12-01'
    }
  ]);

  const handleLogin = (username: string, password: string): boolean => {
    // Validación hardcoded para demo
    if (username === 'admin' && password === currentPassword) {
      setIsAuthenticated(true);
      setShowLogin(false);
      setPaginaActual('clientes'); // Ir directamente a clientes después del login
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPaginaActual('asistencias');
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleCancelLogin = () => {
    setShowLogin(false);
  };

  // Handler para registrar asistencia
  const handleRegisterAttendance = (clienteName: string) => {
    // Buscar cliente por nombre
    const cliente = clientes.find(c => c.nombreCompleto.toLowerCase() === clienteName.toLowerCase());
    if (!cliente) return;

    // Buscar membresía activa del cliente
    const membresia = membresias.find(m => m.clienteId === cliente.id && m.estado === 'Activa');
    if (!membresia) return;

    // Crear nuevo registro de asistencia
    const nuevaAsistencia: IAsistencia = {
      asistenciaId: Date.now(),
      membresiaId: membresia.membresiaId,
      fechaCheckIn: new Date().toISOString()
    };

    setAsistencias([nuevaAsistencia, ...asistencias]);
  };

  // Handler para cambiar contraseña
  const handlePasswordChange = (oldPassword: string, newPassword: string): boolean => {
    if (oldPassword === currentPassword) {
      setCurrentPassword(newPassword);
      return true;
    }
    return false;
  };

  // Si está mostrando el login, renderizar LoginPagina
  if (showLogin) {
    return <LoginPagina onLogin={handleLogin} onCancel={handleCancelLogin} />;
  }

  return (
    <div>
      {/* Navigation Bar - Solo visible si está autenticado */}
      {isAuthenticated && (
        <nav className="bg-white shadow-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="flex space-x-8">
                <button
                  onClick={() => setPaginaActual('asistencias')}
                  className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors ${paginaActual === 'asistencias'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                >
                  Asistencias
                </button>
                <button
                  onClick={() => setPaginaActual('clientes')}
                  className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors ${paginaActual === 'clientes'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                >
                  Clientes
                </button>
                <button
                  onClick={() => setPaginaActual('equipamiento')}
                  className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors ${paginaActual === 'equipamiento'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                >
                  Equipamiento
                </button>
                <button
                  onClick={() => setPaginaActual('finanzas')}
                  className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors ${paginaActual === 'finanzas'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                >
                  Finanzas
                </button>
                <button
                  onClick={() => setPaginaActual('configuraciones')}
                  className={`py-4 px-3 border-b-2 font-medium text-sm transition-colors ${paginaActual === 'configuraciones'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                >
                  Configuraciones
                </button>
              </div>

              {/* Botón de logout */}
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
        ) : paginaActual === 'equipamiento' ? (
          <EquipamientoPagina
            equipamiento={equipamiento}
            setEquipamiento={setEquipamiento}
            accesorios={accesorios}
            setAccesorios={setAccesorios}
            mantenimientos={mantenimientos}
            setMantenimientos={setMantenimientos}
          />
        ) : paginaActual === 'finanzas' ? (
          <FinanzasPagina
            pagos={pagos}
            setPagos={setPagos}
            mantenimientos={mantenimientos}
            membresias={membresias}
            equipamiento={equipamiento}
            clientes={clientes}
          />
        ) : (
          <ConfiguracionesPagina
            tiposMembresia={tiposMembresia}
            setTiposMembresia={setTiposMembresia}
            onPasswordChange={handlePasswordChange}
          />
        )
      ) : (
        <AsistenciaPagina
          onLoginClick={handleLoginClick}
          onRegisterAttendance={handleRegisterAttendance}
        />
      )}
    </div>
  );
}

export default App;