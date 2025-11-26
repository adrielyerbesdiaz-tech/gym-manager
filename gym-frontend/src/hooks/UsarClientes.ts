// hooks/useClientes.ts
import { useState, useEffect } from 'react';
import { ClienteApi } from '../api/rutas/ApiCliente';
import { MembresiaApi } from '../api/rutas/ApiMembresia';
import { TipoMembresiaApi } from '../api/rutas/ApiTipoMembresia';
import { AsistenciaApi } from '../api/rutas/ApiAsistencia';
import { PagoApi } from '../api/rutas/ApiPago';
import type { ICliente } from '../models/ICliente';
import type { IAsistencia } from '../models/IAsistencia';
import type { IMembresia } from '../models/IMembresia';
import type { ITipoMembresia } from '../models/ITipoMembresia';
import type { IPago } from '../models/IPago';

export const useClientesData = () => {
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [asistencias, setAsistencias] = useState<IAsistencia[]>([]);
  const [membresias, setMembresias] = useState<IMembresia[]>([]);
  const [tiposMembresia, setTiposMembresia] = useState<ITipoMembresia[]>([]);
  const [pagos, setPagos] = useState<IPago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [
        clientesData,
        asistenciasData,
        membresiasData,
        tiposMembresiaData,
        pagosData
      ] = await Promise.all([
        ClienteApi.obtenerClientes(),
        AsistenciaApi.obtenerAsistenciasHoy(),
        MembresiaApi.obtenerMembresias(),
        TipoMembresiaApi.obtenerTiposMembresia(),
        PagoApi.obtenerPagos()
      ]);

      setClientes(clientesData);
      setAsistencias(asistenciasData);
      setMembresias(membresiasData);
      setTiposMembresia(tiposMembresiaData);
      setPagos(pagosData);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return {
    clientes,
    asistencias,
    membresias,
    tiposMembresia,
    pagos,
    loading,
    error,
    refetch: cargarDatos,
    setClientes,
    setMembresias,
    setPagos
  };
};