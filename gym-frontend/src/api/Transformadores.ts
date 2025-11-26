// Transformadores para convertir datos del backend al formato del frontend

export const transformClienteFromBackend = (cliente: any): any => ({
  id: cliente.Id || cliente.id,
  nombreCompleto: cliente.nombreCompleto,
  telefono: cliente.telefono.toString(),
  idTipoMembresia: 1, // Por ahora hardcoded
  fechaRegistro: cliente.fechaRegistro,
  notas: cliente.notas || ''
});

export const transformTipoMembresiaFromBackend = (tipo: any): any => ({
  tipoMembresiaId: tipo.tipoMembresiaID || tipo.ID,
  nombre: tipo.nombre,
  duracionValor: tipo.duracionValor || tipo.Duracion_Valor, 
  duracionTipo: tipo.duracionTipo || tipo.Duracion_Tipo,     
  duracionDias: tipo.duracionDias || tipo.duracionValor || tipo.Duracion_Valor,   
  precio: tipo.precio
});

export const transformAsistenciaFromBackend = (asistencia: any): any => ({
  asistenciaId: asistencia.ID_Asistencia,
  clienteId: asistencia.ID_Cliente,
  fechaCheckIn: asistencia.Fecha_Check_In,
});

export const transformMembresiaFromBackend = (membresia: any): any => ({
  membresiaId: membresia.ID,
  tipoMembresiaID: membresia.ID_Tipo,
  usuarioID: membresia.ID_Cliente,
  fechaInicio: membresia.Fecha_Inicio,
});