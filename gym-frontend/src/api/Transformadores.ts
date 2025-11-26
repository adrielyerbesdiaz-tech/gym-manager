// Transformadores para convertir datos del backend al formato del frontend

// Cliente
export const transformClienteFromBackend = (cliente: any): any => ({
  id: cliente.Id || cliente.id,
  nombreCompleto: cliente.nombreCompleto,
  telefono: cliente.telefono.toString(),
  fechaRegistro: cliente.fechaRegistro,
  notas: cliente.notas || ''
});

// Tipo Membresía
export const transformTipoMembresiaFromBackend = (tipo: any): any => ({
  tipoMembresiaId: tipo.tipoMembresiaID || tipo.ID,
  nombre: tipo.nombre,
  duracionValor: tipo.duracionValor || tipo.Duracion_Valor, 
  duracionTipo: tipo.duracionTipo || tipo.Duracion_Tipo,     
  precio: tipo.precio
});

// Asistencia
export const transformAsistenciaFromBackend = (asistencia: any): any => ({
  asistenciaId: asistencia.ID_Asistencia,
  clienteId: asistencia.ID_Cliente,
  fechaCheckIn: asistencia.Fecha_Check_In,
});

// Membresía
export const transformMembresiaFromBackend = (membresia: any): any => ({
  membresiaId: membresia.ID,
  tipoMembresiaID: membresia.ID_Tipo,
  usuarioID: membresia.ID_Cliente,
  fechaInicio: membresia.Fecha_Inicio,
});

// Equipamiento
export const transformEquipamientoFromBackend = (equipamiento: any): any => ({
  equipamientoId: equipamiento.ID || equipamiento.equipamientoId,
  nombre: equipamiento.nombre,
  tipo: equipamiento.tipo,
  imagenUrl: equipamiento.imagenUrl,
  descripcion: equipamiento.descripcion
});

// Mantenimiento
export const transformMantenimientoFromBackend = (mantenimiento: any): any => ({
  mantenimientoId: mantenimiento.ID || mantenimiento.mantenimientoId,
  tipo: mantenimiento.tipo,
  fecha: mantenimiento.fecha
});

// Equipamiento Accesorio
export const transformEquipamientoAccesorioFromBackend = (accesorio: any): any => ({
  accesorioId: accesorio.ID || accesorio.accesorioId,
  equipoId: accesorio.equipoId || accesorio.ID_Equipo,
  nombre: accesorio.nombre,
  notas: accesorio.notas
});

// Pago
export const transformPagoFromBackend = (pago: any): any => ({
  pagoId: pago.ID || pago.pagoId,
  membresiaID: pago.membresiaID || pago.ID_Membresia,
  monto: pago.monto,
  fecha: pago.fecha
});

// Usuario
export const transformUsuarioFromBackend = (usuario: any): any => ({
  usuarioId: usuario.ID || usuario.usuarioId,
  nombreUsuario: usuario.nombreUsuario,
  contrasenaHash: usuario.contrasenaHash
});