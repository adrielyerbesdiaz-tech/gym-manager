import { tipoMembresia } from '../entidades/TipoMembresiaa';
import { GestorTipoMembresia } from '../gestores/GestorTipoMembresia';

export class ServicioTipoMembresia {
    private readonly gestorTipoMembresia: GestorTipoMembresia;
    private readonly tiposDuracionValidos = ['dias', 'semanas', 'meses'];

    constructor(gestorTipoMembresia: GestorTipoMembresia) {
        this.gestorTipoMembresia = gestorTipoMembresia;
    }

    // Crear nuevo tipo de membresía
    public crear(
        nombre: string, 
        duracionValor: number, 
        duracionTipo: string, 
        precio: number
    ): number {
        // Validaciones
        if (!nombre || nombre.trim() === '') {
            throw new Error('El nombre es obligatorio');
        }

        if (nombre.trim().length < 3) {
            throw new Error('El nombre debe tener al menos 3 caracteres');
        }

        if (duracionValor <= 0) {
            throw new Error('La duración debe ser mayor a 0');
        }

        if (!this.tiposDuracionValidos.includes(duracionTipo.toLowerCase())) {
            throw new Error('Tipo de duración inválido. Use: dias, semanas o meses');
        }

        if (precio < 0) {
            throw new Error('El precio no puede ser negativo');
        }

        // Verificar que no exista un tipo con el mismo nombre
        const tiposExistentes = this.gestorTipoMembresia.buscarPorNombre(nombre.trim());
        if (tiposExistentes.length > 0) {
            throw new Error('Ya existe un tipo de membresía con ese nombre');
        }

        const nuevoTipo = new tipoMembresia(
            nombre.trim(),
            duracionValor,
            duracionTipo.toLowerCase(),
            precio
        );

        return this.gestorTipoMembresia.agregar(nuevoTipo);
    }

    // Actualizar tipo de membresía completo
    public actualizar(
        id: number, 
        nombre: string, 
        duracionValor: number, 
        duracionTipo: string, 
        precio: number
    ): void {
        const tipoExistente = this.gestorTipoMembresia.buscarPorId(id);
        
        if (!tipoExistente) {
            throw new Error('Tipo de membresía no encontrado');
        }

        // Validaciones
        if (!nombre || nombre.trim() === '') {
            throw new Error('El nombre es obligatorio');
        }

        if (nombre.trim().length < 3) {
            throw new Error('El nombre debe tener al menos 3 caracteres');
        }

        if (duracionValor <= 0) {
            throw new Error('La duración debe ser mayor a 0');
        }

        if (!this.tiposDuracionValidos.includes(duracionTipo.toLowerCase())) {
            throw new Error('Tipo de duración inválido. Use: dias, semanas o meses');
        }

        if (precio < 0) {
            throw new Error('El precio no puede ser negativo');
        }

        // Verificar que no exista otro tipo con el mismo nombre
        const tiposConMismoNombre = this.gestorTipoMembresia.buscarPorNombre(nombre.trim());
        const nombreDuplicado = tiposConMismoNombre.some(
            t => t.getTipoMembresiaID() !== id && 
                 t.getNombre().toLowerCase() === nombre.trim().toLowerCase()
        );

        if (nombreDuplicado) {
            throw new Error('Ya existe otro tipo de membresía con ese nombre');
        }

        // Actualizar usando los setters
        tipoExistente.setNombre(nombre.trim());
        tipoExistente.setDuracionValor(duracionValor);
        tipoExistente.setDuracionTipo(duracionTipo.toLowerCase());
        tipoExistente.setPrecio(precio);

        const actualizado = this.gestorTipoMembresia.actualizar(tipoExistente);

        if (!actualizado) {
            throw new Error('Error al actualizar el tipo de membresía');
        }
    }

    // Actualizar solo el precio
    public actualizarPrecio(id: number, precio: number): void {
        const tipoExistente = this.gestorTipoMembresia.buscarPorId(id);
        
        if (!tipoExistente) {
            throw new Error('Tipo de membresía no encontrado');
        }

        if (precio < 0) {
            throw new Error('El precio no puede ser negativo');
        }

        const actualizado = this.gestorTipoMembresia.actualizarPrecio(id, precio);

        if (!actualizado) {
            throw new Error('Error al actualizar el precio');
        }
    }

    // Actualizar solo el nombre
    public actualizarNombre(id: number, nombre: string): void {
        const tipoExistente = this.gestorTipoMembresia.buscarPorId(id);
        
        if (!tipoExistente) {
            throw new Error('Tipo de membresía no encontrado');
        }

        if (!nombre || nombre.trim() === '') {
            throw new Error('El nombre es obligatorio');
        }

        if (nombre.trim().length < 3) {
            throw new Error('El nombre debe tener al menos 3 caracteres');
        }

        // Verificar duplicados
        const tiposConMismoNombre = this.gestorTipoMembresia.buscarPorNombre(nombre.trim());
        const nombreDuplicado = tiposConMismoNombre.some(
            t => t.getTipoMembresiaID() !== id
        );

        if (nombreDuplicado) {
            throw new Error('Ya existe otro tipo de membresía con ese nombre');
        }

        const actualizado = this.gestorTipoMembresia.actualizarNombre(id, nombre.trim());

        if (!actualizado) {
            throw new Error('Error al actualizar el nombre');
        }
    }

    // Actualizar duración (valor y tipo)
    public actualizarDuracion(id: number, duracionValor: number, duracionTipo: string): void {
        const tipoExistente = this.gestorTipoMembresia.buscarPorId(id);
        
        if (!tipoExistente) {
            throw new Error('Tipo de membresía no encontrado');
        }

        if (duracionValor <= 0) {
            throw new Error('La duración debe ser mayor a 0');
        }

        if (!this.tiposDuracionValidos.includes(duracionTipo.toLowerCase())) {
            throw new Error('Tipo de duración inválido. Use: dias, semanas o meses');
        }

        const actualizado = this.gestorTipoMembresia.actualizarDuracion(
            id, 
            duracionValor, 
            duracionTipo.toLowerCase()
        );

        if (!actualizado) {
            throw new Error('Error al actualizar la duración');
        }
    }

    // Eliminar tipo de membresía
    public eliminar(id: number): void {
        const tipoExistente = this.gestorTipoMembresia.buscarPorId(id);
        
        if (!tipoExistente) {
            throw new Error('Tipo de membresía no encontrado');
        }

        // Verificar que no esté en uso
        if (this.gestorTipoMembresia.estaEnUso(id)) {
            throw new Error('No se puede eliminar: este tipo de membresía está siendo usado por miembros activos');
        }

        const eliminado = this.gestorTipoMembresia.eliminar(id);

        if (!eliminado) {
            throw new Error('Error al eliminar el tipo de membresía');
        }
    }

    // Buscar tipo de membresía
    public buscar(criterio: string | number): tipoMembresia[] {
        if (typeof criterio === 'number') {
            const tipo = this.gestorTipoMembresia.buscarPorId(criterio);
            return tipo ? [tipo] : [];
        }

        return this.gestorTipoMembresia.buscarPorNombre(criterio);
    }

    // Obtener todos los tipos
    public obtenerTodos(): tipoMembresia[] {
        return this.gestorTipoMembresia.obtenerTodos();
    }

    // Obtener tipos ordenados por precio
    public obtenerPorPrecio(ascendente: boolean = true): tipoMembresia[] {
        return this.gestorTipoMembresia.obtenerPorPrecio(ascendente);
    }

    // Obtener tipos por tipo de duración (dias, semanas, meses)
    public obtenerPorTipoDuracion(duracionTipo: string): tipoMembresia[] {
        if (!this.tiposDuracionValidos.includes(duracionTipo.toLowerCase())) {
            throw new Error('Tipo de duración inválido. Use: dias, semanas o meses');
        }

        return this.gestorTipoMembresia.obtenerPorTipoDuracion(duracionTipo.toLowerCase());
    }

    // Calcular fecha de vencimiento basada en la duración
    public calcularFechaVencimiento(tipoMembresiaId: number, fechaInicio: Date): Date {
        const tipo = this.gestorTipoMembresia.buscarPorId(tipoMembresiaId);
        
        if (!tipo) {
            throw new Error('Tipo de membresía no encontrado');
        }

        const fechaVencimiento = new Date(fechaInicio);
        const valor = tipo.getDuracionValor();
        const tipoDuracion = tipo.getDuracionTipo();

        switch (tipoDuracion) {
            case 'dias':
                fechaVencimiento.setDate(fechaVencimiento.getDate() + valor);
                break;
            case 'semanas':
                fechaVencimiento.setDate(fechaVencimiento.getDate() + (valor * 7));
                break;
            case 'meses':
                fechaVencimiento.setMonth(fechaVencimiento.getMonth() + valor);
                break;
            default:
                throw new Error('Tipo de duración inválido');
        }

        return fechaVencimiento;
    }

    // Validar si un tipo de duración es válido
    public esTipoDuracionValido(duracionTipo: string): boolean {
        return this.tiposDuracionValidos.includes(duracionTipo.toLowerCase());
    }
}