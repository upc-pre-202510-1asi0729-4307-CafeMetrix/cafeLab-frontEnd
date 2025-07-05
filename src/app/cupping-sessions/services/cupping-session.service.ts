import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError, switchMap, map, catchError } from 'rxjs';
import { CuppingSession } from '../model/cupping-session.entity';
import {BaseService} from '../../shared/services/base.service';
import { environment } from '../../../environments/environment';
import { TokenService } from '../../auth/services/token.service';


@Injectable({
  providedIn: 'root'
})
export class CuppingSessionService {

  //private apiUrl = 'https://685056e8e7c42cfd17984fb7.mockapi.io/api/v1/cupping-sessions';

  private apiUrl = `${environment.serverBaseUrl}/api/v1/cupping-sessions`;
  /*private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };*/

  private getHttpOptions() {
    const token = this.tokenService.getToken();
    
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    if (token) {
      httpHeaders = httpHeaders.set('Authorization', `Bearer ${token}`);
    }
    
    return { headers: httpHeaders };
  }

  constructor(private http: HttpClient, private tokenService: TokenService) {}





  /**
   * Transformar datos del backend al formato esperado por el frontend
   */
  private transformBackendData(session: any): CuppingSession {
    // Manejar fecha de forma más robusta
    let fechaValida: Date;
    if (session.fecha || session.date || session.createdAt) {
      const fechaOriginal = session.fecha || session.date || session.createdAt;
      fechaValida = new Date(fechaOriginal);
      if (isNaN(fechaValida.getTime())) {
        fechaValida = new Date();
      }
    } else {
      fechaValida = new Date();
    }

    // Mapear campos del backend a formato del frontend
    return {
      id: session.id?.toString(),
      fecha: fechaValida,
      favorito: session.favorito || session.favorite || false,
      user_id: session.user_id || session.userId || 'user1',
      
      // Mapear nombre (puede venir como 'name' o 'nombre')
      nombre: session.nombre ? 
        (typeof session.nombre === 'string' ? { name: session.nombre } : session.nombre) :
        (session.name ? { name: session.name } : { name: 'Sin nombre' }),
      
      // Mapear origen (puede venir como 'origin' o 'origen')  
      origen: session.origen ?
        (typeof session.origen === 'string' ? { name: session.origen } : session.origen) :
        (session.origin ? { name: session.origin } : { name: 'Sin origen' }),
      
      // Mapear variedad (puede venir como 'variety' o 'variedad')
      variedad: session.variedad ?
        (typeof session.variedad === 'string' ? { name: session.variedad } : session.variedad) :
        (session.variety ? { name: session.variety } : { name: 'Sin variedad' }),
      
      // Mapear lote
      lote: session.lote ?
        (typeof session.lote === 'string' ? { id: session.lote } : session.lote) :
        (session.lot ? { id: session.lot } : undefined),
      
      // Mapear perfil de tueste
      perfil_tueste: session.perfil_tueste ?
        (typeof session.perfil_tueste === 'string' ? { id: session.perfil_tueste } : session.perfil_tueste) :
        (session.roastProfile ? { id: session.roastProfile } : undefined),
      
      // Mapear procesamiento (puede venir como 'processingMethod' o 'procesamiento')
      procesamiento: session.procesamiento ?
        (typeof session.procesamiento === 'string' ? { name: session.procesamiento } : session.procesamiento) :
        (session.processingMethod ? { name: session.processingMethod } : undefined)
    };
  }

  /**
   * Datos de ejemplo para desarrollo (cuando el backend no está disponible)
   */
  private getMockData(): CuppingSession[] {
    return [
      {
        id: '1',
        nombre: { name: 'Sesión de Cata - Colombia' },
        origen: { name: 'Colombia Huila' },
        variedad: { name: 'Bourbon' },
        fecha: new Date(),
        favorito: false,
        lote: { id: 'lote-001' },
        perfil_tueste: { id: 'perfil-medium' },
        procesamiento: { name: 'Lavado' },
        user_id: 'user1'
      }
    ];
  }

  /**
   * Obtener todas las sesiones
   */
  getAll(): Observable<CuppingSession[]> {
    return this.http.get<any[]>(this.apiUrl, this.getHttpOptions()).pipe(
      map(sessions => sessions.map(session => this.transformBackendData(session))),
      catchError(error => {
        // Si es error 401, intentar sin token
        if (error.status === 401) {
          return this.http.get<any[]>(this.apiUrl, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }).pipe(
            map(sessions => sessions.map(session => this.transformBackendData(session))),
            catchError(() => of(this.getMockData()))
          );
        }
        return of(this.getMockData());
      })
    );
  }

  /**
   * Obtener valores únicos de origen, variedad y procesamiento
   */
  getDistinctValues(userId: string): Observable<{
    origenes: string[],
    variedades: string[],
    procesamientos: string[]
  }> {
    return this.getAll().pipe(
      map(sessions => {
        const delUsuario = sessions.filter(s => s.user_id === userId);
        const origenes = [...new Set(delUsuario.map(s => s.origen.name).filter(Boolean))];
        const variedades = [...new Set(delUsuario.map(s => s.variedad.name).filter(Boolean))];
        const procesamientos = [...new Set(delUsuario.map(s => s.procesamiento?.name).filter(Boolean))] as string[];
        return { origenes, variedades, procesamientos };
      })
    );
  }

  /**
   * Buscar por nombre, origen o variedad, y filtrar por usuario
   */
  search(query: string, userId: string): Observable<CuppingSession[]> {
    return this.getAll().pipe(
      map(sessions => {
        const q = query.toLowerCase().trim();
        return sessions
          .filter(s => s.user_id === userId)
          .filter(s =>
            s.nombre.name.toLowerCase().includes(q) ||
            s.origen.name.toLowerCase().includes(q) ||
            s.variedad.name.toLowerCase().includes(q)
          );
      })
    );
  }

  /**
   * Obtener solo los favoritos
   */
  getFavorites(userId: string): Observable<CuppingSession[]> {
    return this.getAll().pipe(
      map(sessions =>
        sessions.filter(s => s.user_id === userId && s.favorito)
      )
    );
  }

  update(id: string, session: Partial<CuppingSession>): Observable<CuppingSession> {
    // Para updates parciales, solo transformar si es una sesión completa
    const payload = session.nombre ? this.transformToBackendFormat(session as CuppingSession) : session;
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload, this.getHttpOptions())
      .pipe(
        map(response => this.transformBackendData(response)),
        catchError(this.handleError)
      );
  }

  create(session: CuppingSession): Observable<CuppingSession> {
    const backendPayload = this.transformToBackendFormat(session);
    return this.http.post<any>(this.apiUrl, backendPayload, this.getHttpOptions())
      .pipe(
        map(response => this.transformBackendData(response)),
        catchError(this.handleError)
      );
  }

  /**
   * Alternar favorito
   */
  toggleFavorite(id: string): Observable<CuppingSession | null> {
    return this.getById(id).pipe(
      map(session => {
        if (!session) throw new Error('Sesión no encontrada');
        return { ...session, favorito: !session.favorito };
      }),
      switchMap(updated => {
        const backendPayload = this.transformToBackendFormat(updated);
        return this.http.put<any>(`${this.apiUrl}/${id}`, backendPayload, this.getHttpOptions());
      }),
      map(response => this.transformBackendData(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Obtener por ID
   */
  getById(id: string): Observable<CuppingSession | null> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, this.getHttpOptions()).pipe(
      map(s => this.transformBackendData(s)),
      catchError(() => of(null))
    );
  }

  /**
   * Crear sesión temporal para desarrollo (cuando el backend no está disponible)
   */
  private createMockSession(session: Omit<CuppingSession, 'id' | 'fecha'>): CuppingSession {
    return {
      ...session,
      id: Math.random().toString(36).substr(2, 9),
      fecha: new Date()
    };
  }

  /**
   * Transformar objeto del frontend al formato que espera el backend
   */
  private transformToBackendFormat(session: CuppingSession): any {
    return {
      cuppingSessionName: { name: session.nombre.name },
      origin: { value: session.origen.name },
      variety: { value: session.variedad.name },
      processingMethod: { value: session.procesamiento?.name || 'Lavado' },
      favorite: session.favorito,
      roastProfile: { value: session.perfil_tueste?.id || 'Medium' },
      lotId: { value: session.lote?.id ? parseInt(session.lote.id) : 1 },
      date: new Date(session.fecha).toISOString().replace(/\.\d{3}Z$/, '')
    };
  }

  /**
   * Registrar nueva sesión
   */
  add(session: Omit<CuppingSession, 'id' | 'fecha'>): Observable<CuppingSession> {
    const newSession: CuppingSession = {
      ...session,
      fecha: new Date().toISOString(),
      favorito: false
    };
    
    // Transformar al formato del backend
    const backendPayload = this.transformToBackendFormat(newSession);
    
    return this.http.post<any>(this.apiUrl, backendPayload, this.getHttpOptions())
      .pipe(
        map(response => this.transformBackendData(response)),
        catchError(error => {
          // Si es error 401, intentar sin token
          if (error.status === 401) {
            return this.http.post<any>(this.apiUrl, backendPayload, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }).pipe(
              map(response => this.transformBackendData(response)),
              catchError(() => {
                // Crear sesión temporal para desarrollo
                console.warn('⚠️ No se pudo conectar al backend. Usando sesión temporal para desarrollo.');
                return of(this.createMockSession(session));
              })
            );
          }
          console.warn('⚠️ Error al crear sesión. Usando sesión temporal para desarrollo.');
          return of(this.createMockSession(session));
        })
      );
  }



  /**
   * Manejo de errores
   */
  private handleError(error: any) {
    const msg = error?.message || 'Error desconocido al conectar con Servidor';
    console.error('Error:', msg);
    return throwError(() => new Error(msg));
  }
}
