// components/ClientesContainer.tsx
import { useClientesData } from '../hooks/UsarClientes';
import ClientesPagina from '../pages/ClientesPagina';
import { LoadingSpinner } from './ui/LoadingSpinner';

export default function ClientesContainer() {
  const {
    clientes,
    asistencias,
    membresias,
    tiposMembresia,
    pagos,
    loading,
    error,
    setClientes,
    setMembresias,
    setPagos
  } = useClientesData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
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
  );
}