import { ApiBase } from '../ApiBase';

export class UsuarioApi {
  static async obtenerUsuarios(): Promise<any[]> {
    return ApiBase.get('/usuarios');
  }

  static async crearUsuario(usuarioData: any): Promise<{ id: number }> {
    return ApiBase.post('/usuarios', usuarioData);
  }

  static async obtenerUsuarioPorId(id: number): Promise<any> {
    return ApiBase.get(`/usuarios/${id}`);
  }

  static async buscarUsuarioPorNombre(nombreUsuario: string): Promise<any> {
    return ApiBase.get(`/usuarios/buscar/nombre/${encodeURIComponent(nombreUsuario)}`);
  }

  static async actualizarNombreUsuario(id: number, nombreUsuario: string): Promise<void> {
    await ApiBase.patch(`/usuarios/${id}/nombre`, { nombreUsuario });
  }

  static async actualizarContrasenaUsuario(id: number, contrasenaHash: string): Promise<void> {
    await ApiBase.patch(`/usuarios/${id}/contrasena`, { contrasenaHash });
  }

  static async eliminarUsuario(id: number): Promise<void> {
    await ApiBase.delete(`/usuarios/${id}`);
  }
}