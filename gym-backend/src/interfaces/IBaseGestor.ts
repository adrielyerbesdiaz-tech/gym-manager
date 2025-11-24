export interface IBaseGestor<T> {
    guardar(entidad: T): void;
    actualizar(entidad: T): void;
    eliminar(id: number): void;
    obtenerPorId(id: number): T | null;
    obtenerTodos(): T[];
}