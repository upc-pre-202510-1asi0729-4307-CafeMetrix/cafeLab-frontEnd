import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpInstanceService } from '../../shared/services/http-instance.service';
import { User } from '../model/user.entity';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpInstance: HttpInstanceService) {}

  /**
   * Registra un nuevo usuario en el sistema
   * @param userData - Datos del usuario a registrar
   * @returns Promise con la respuesta del servidor
   */
  async register(userData: User): Promise<User> {
    try {
      // Marcar como primer inicio de sesión
      userData.isFirstLogin = true;

      return await lastValueFrom(
        this.httpInstance.post<User>('/users', userData)
      );
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los usuarios registrados
   * @returns Promise con la lista de usuarios
   */
  async getUsers(): Promise<User[]> {
    try {
      const users = await lastValueFrom(
        this.httpInstance.get<User[]>('/users')
      );
      console.log('Usuarios obtenidos:', users);
      return users;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  /**
   * Busca un usuario por su correo electrónico
   * @param email - Correo electrónico del usuario
   * @returns Promise con el usuario encontrado o null
   */
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      console.log('Buscando usuario por email:', email);
      const users = await lastValueFrom(
        this.httpInstance.get<User[]>('/users', { email })
      );
      console.log('Resultado de búsqueda:', users);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error buscando usuario por email:', error);
      return null;
    }
  }

  /**
   * Intenta iniciar sesión con email y contraseña
   * @param email - Correo electrónico del usuario
   * @param password - Contraseña del usuario
   * @returns Promise con el usuario si las credenciales son correctas
   */
  async login(email: string, password: string): Promise<User | null> {
    try {
      console.log('Intentando login con:', { email, password });
      const users = await lastValueFrom(
        this.httpInstance.get<User[]>('/users', { email })
      );

      if (users.length > 0) {
        const user = users[0];
        // Verificar la contraseña
        if (user.password === password) {
          console.log('Login exitoso');

          // Asegurarse de que hasPlan exista si el usuario ya seleccionó un plan
          if (user.hasPlan === "true") {
            user.hasPlan = true;
          }

          // Guardar en localStorage
          localStorage.setItem('currentUser', JSON.stringify(user));

          return user;
        }
        console.log('Contraseña incorrecta');
      }
      console.log('Usuario no encontrado');
      return null;
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      throw new Error('Error de autenticación');
    }
  }

  /**
   * Cierra la sesión del usuario actual
   */
  logout(): void {
    localStorage.removeItem('currentUser');
  }

  /**
   * Verifica si hay un usuario autenticado
   * @returns true si hay un usuario autenticado
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  /**
   * Obtiene el usuario autenticado actual
   * @returns El usuario autenticado o null
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
        return null;
      }
    }
    return null;
  }
}
