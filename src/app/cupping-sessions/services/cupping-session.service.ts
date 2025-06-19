import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError, switchMap, map, catchError } from 'rxjs';
import { CuppingSession } from '../model/cupping-session.entity';
import {BaseService} from '../../shared/services/base.service';

@Injectable({
  providedIn: 'root'
})
export class CuppingSessionService {
  private apiUrl = 'https://685056e8e7c42cfd17984fb7.mockapi.io/api/v1/cupping-sessions';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las sesiones
   */
  getAll(): Observable<CuppingSession[]> {
    return this.http.get<CuppingSession[]>(this.apiUrl).pipe(
      map(sessions =>
        sessions.map(session => ({
          ...session,
          fecha: new Date(session.fecha ?? '')
        }))
      ),
      catchError(this.handleError)
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
        const origenes = [...new Set(delUsuario.map(s => s.origen).filter(Boolean))];
        const variedades = [...new Set(delUsuario.map(s => s.variedad).filter(Boolean))];
        const procesamientos = [...new Set(delUsuario.map(s => s.procesamiento).filter(Boolean))] as string[];
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
            s.nombre.toLowerCase().includes(q) ||
            s.origen.toLowerCase().includes(q) ||
            s.variedad.toLowerCase().includes(q)
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
    return this.http.put<CuppingSession>(`${this.apiUrl}/${id}`, session, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  create(session: CuppingSession): Observable<CuppingSession> {
    return this.http.post<CuppingSession>(this.apiUrl, session, this.httpOptions)
      .pipe(catchError(this.handleError));
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
      switchMap(updated =>
        this.http.put<CuppingSession>(`${this.apiUrl}/${id}`, updated, this.httpOptions)
      ),
      catchError(this.handleError)
    );
  }

  /**
   * Obtener por ID
   */
  getById(id: string): Observable<CuppingSession | null> {
    return this.http.get<CuppingSession>(`${this.apiUrl}/${id}`).pipe(
      map(s => ({
        ...s,
        fecha: new Date(s.fecha ?? '')
      })),
      catchError(() => of(null))
    );
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
    return this.http.post<CuppingSession>(this.apiUrl, newSession, this.httpOptions)
      .pipe(catchError(this.handleError));
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
