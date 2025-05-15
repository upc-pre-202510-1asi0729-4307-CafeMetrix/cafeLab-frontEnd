import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  // URL base de la API (deberías ajustarla según tu configuración)
  private apiUrl = 'api/profile';

  constructor(private http: HttpClient) { }

  /**
   * Actualiza el perfil del usuario
   * @param userData Datos del usuario a actualizar
   * @returns Promise que resuelve los datos del usuario actualizado
   */
  async updateProfile(userData: any): Promise<any> {
    try {
      // Si estamos en un entorno de desarrollo sin backend, simulamos la respuesta
      if (!this.isProductionEnvironment()) {
        console.log('Simulando actualización de perfil en entorno de desarrollo:', userData);
        return Promise.resolve(userData);
      }

      // Para un entorno real, hacemos la petición al backend
      return await firstValueFrom(this.http.put(`${this.apiUrl}/${userData.id}`, userData));
    } catch (error) {
      console.error('Error en el servicio al actualizar perfil:', error);
      throw error;
    }
  }

  /**
   * Determina si la aplicación está en un entorno de producción o desarrollo
   * Puedes ajustar esta lógica según tu configuración
   */
  private isProductionEnvironment(): boolean {
    // Asumimos ambiente de desarrollo por defecto
    // En Angular podrías usar environment.production para esto
    return false;
  }
}
