const API_BASE_URL = 'http://localhost:5000/api';

// Función mejorada para manejar respuestas
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      // Si no se puede parsear JSON, usar el mensaje por defecto
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

// ==================== TRANSFORMADORES ====================

// El backend devuelve objetos con estos campos (según tu GestorCliente)
const transformClienteFromBackend = (cliente: any): any => ({
  id: cliente.Id || cliente.id,  // Backend usa 'Id' mayúscula
  nombreCompleto: cliente.nombreCompleto,
  telefono: cliente.telefono.toString(), // Convertir a string para el frontend
  idTipoMembresia: 1, // Por ahora hardcoded
  fechaRegistro: cliente.fechaRegistro,
  notas: cliente.notas || ''
});

const transformTipoMembresiaFromBackend = (tipo: any): any => ({
  tipoMembresiaId: tipo.tipoMembresiaID || tipo.ID,
  nombre: tipo.nombre,
  duracionDias: tipo.duracionValor, // Ahora usas duracionValor
  duracionTipo: tipo.duracionTipo,  // Añadir duracionTipo
  precio: tipo.precio
});

// Nuevo transformador para Asistencias
const transformAsistenciaFromBackend = (asistencia: any): any => ({
  asistenciaId: asistencia.ID_Asistencia, // DB: ID_Asistencia
  clienteId: asistencia.ID_Cliente,       // DB: ID_Cliente
  fechaCheckIn: asistencia.Fecha_Check_In, // DB: Fecha_Check_In
});

// Nuevo transformador para Membresías
const transformMembresiaFromBackend = (membresia: any): any => ({
  membresiaId: membresia.ID,             // DB: ID
  tipoMembresiaID: membresia.ID_Tipo,    // DB: ID_Tipo
  usuarioID: membresia.ID_Cliente,       // ¡CLAVE! Mapear ID_Cliente de DB a usuarioID de la clase membresia
  fechaInicio: membresia.Fecha_Inicio,   // DB: Fecha_Inicio
});

export class ClienteApi {

  // ==================== CLIENTES ====================

  static async obtenerClientes(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/clientes`);
    const data = await handleResponse(response);
    return data.map(transformClienteFromBackend);
  }

  static async buscarClientes(criterio: string): Promise<any[]> {
  if (!criterio.trim()) return [];
  
  const response = await fetch(
    `${API_BASE_URL}/clientes/buscar/${encodeURIComponent(criterio)}`
  );
  const data = await handleResponse(response);
  return data.map(transformClienteFromBackend);
}

 static async buscarClientePorTelefono(telefono: string): Promise<any | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/clientes/telefono/${encodeURIComponent(telefono)}`
    );
    
    if (response.status === 404) {
      return null; // Cliente no encontrado
    }
    
    const data = await handleResponse(response);
    return transformClienteFromBackend(data);
    
  } catch (error) {
    console.error('Error buscando cliente por teléfono:', error);
    
    // Fallback: usar búsqueda general y filtrar
    try {
      const clientes = await this.buscarClientes(telefono);
      const clienteExacto = clientes.find((cliente: any) => 
        cliente.telefono === telefono
      );
      return clienteExacto || null;
    } catch (fallbackError) {
      console.error('Error en fallback:', fallbackError);
      return null;
    }
  }
}


  static async crearCliente(clienteData: any): Promise<{ id: number }> {
    const response = await fetch(`${API_BASE_URL}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: clienteData.nombreCompleto,
        telefono: clienteData.telefono,
        notas: clienteData.notas || ''
      })
    });
    return handleResponse(response);
  }

  static async actualizarClienteNotas(id: number, notas: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}/notas`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notas })
    });
    await handleResponse(response);
  }

  static async actualizarClienteTelefono(id: number, telefono: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}/telefono`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telefono })
    });
    await handleResponse(response);
  }

  static async actualizarCliente(id: number, clienteData: any): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: clienteData.nombreCompleto,
      telefono: clienteData.telefono,
      notas: clienteData.notas || ''
    })
  });
  await handleResponse(response);
}

  static async eliminarCliente(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
      method: 'DELETE'
    });
    await handleResponse(response);
  }

  // ==================== TIPOS DE MEMBRESÍA ====================
  
  static async obtenerTiposMembresia(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/tipos-membresia`);
    const data = await handleResponse(response);
    return data.map(transformTipoMembresiaFromBackend);
  }

  static async crearTipoMembresia(tipoMembresiaData: any): Promise<{ id: number }> {
    const response = await fetch(`${API_BASE_URL}/tipos-membresia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: tipoMembresiaData.nombre,
        duracionValor: tipoMembresiaData.duracionValor,
        duracionTipo: tipoMembresiaData.duracionTipo,
        precio: tipoMembresiaData.precio
      })
    });
    return handleResponse(response);
  }

  static async actualizarTipoMembresia(id: number, tipoMembresiaData: any): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tipos-membresia/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: tipoMembresiaData.nombre,
        duracionValor: tipoMembresiaData.duracionValor,
        duracionTipo: tipoMembresiaData.duracionTipo,
        precio: tipoMembresiaData.precio
      })
    });
    await handleResponse(response);
  }

  static async eliminarTipoMembresia(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tipos-membresia/${id}`, {
      method: 'DELETE'
    });
    await handleResponse(response);
  }

  // ==================== ASISTENCIAS ====================

  static async registrarAsistencia(clienteId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/asistencias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clienteId })
    });
    return handleResponse(response);
  }

  static async verificarAsistenciaHoy(clienteId: number): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/asistencias/verificar/${clienteId}`);
    const data = await handleResponse(response);
    return data.yaRegistro;
  }

  static async obtenerAsistenciasHoy(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/asistencias/hoy`);
    return handleResponse(response);
  }

  static async obtenerAsistenciasCliente(clienteId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/asistencias/cliente/${clienteId}`);
    return handleResponse(response);
  }

static async obtenerTodasLasAsistencias(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/asistencias`);
  const data = await handleResponse(response);
  // Aplicar transformación a cada elemento
  return data.map(transformAsistenciaFromBackend);
}

  static async obtenerEstadisticasAsistencias(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/asistencias/estadisticas`);
    return handleResponse(response);
  }

  // ==================== MEMBRESÍAS ====================

static async obtenerTodasLasMembresias(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/membresias`); // Asumo que tienes un endpoint /membresias
  const data = await handleResponse(response);
  // Aplicar transformación a cada elemento
  return data.map(transformMembresiaFromBackend);
}

  // ==================== PAGOS ====================

  static async registrarPago(membresiaID: number, monto: number): Promise<{ id: number }> {
    const response = await fetch(`${API_BASE_URL}/pagos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ membresiaID, monto })
    });
    return handleResponse(response);
  }

  static async obtenerTodosLosPagos(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/pagos`);
    return handleResponse(response);
  }

  static async obtenerPagosPorMembresia(membresiaId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/pagos/membresia/${membresiaId}`);
    return handleResponse(response);
  }

  static async eliminarPago(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/pagos/${id}`, {
      method: 'DELETE'
    });
    await handleResponse(response);
  }
}