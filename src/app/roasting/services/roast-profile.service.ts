import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of, switchMap, map, tap, catchError } from 'rxjs';
import { RoastProfile } from '../models/roast-profile.model';


@Injectable({
  providedIn: 'root'
})
export class RoastProfileService {
  private apiUrl = 'https://682697d8397e48c913169c83.mockapi.io/roast-profile';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los perfiles de tostado
   */
  getRoastProfiles(): Observable<RoastProfile[]> {
    return this.http.get<RoastProfile[]>(this.apiUrl).pipe(

      map(profiles => profiles.map(p => ({
        ...p,
        createdAt: new Date(p.createdAt ?? '')
      }))),
      catchError(this.handleError)
    );
  }

  /**
   * Buscar perfiles por nombre, tipo o proveedor
   */
  searchRoastProfiles(query: string): Observable<RoastProfile[]> {
    return this.getRoastProfiles().pipe(
      map(profiles => {
        const normalizedQuery = query.toLowerCase().trim();
        return profiles.filter(profile =>
          profile.name.toLowerCase().includes(normalizedQuery) ||
          profile.type.toLowerCase().includes(normalizedQuery) ||
          profile.lot.toLowerCase().includes(normalizedQuery)
        );
      })
    );
  }

  /**
   * Filtrar por favoritos y ordenar por fecha
   */
  filterProfiles(showFavoritesOnly: boolean, sortOrder: 'asc' | 'desc'): Observable<RoastProfile[]> {
    return this.getRoastProfiles().pipe(
      map(profiles => {
        let filtered = profiles;
        if (showFavoritesOnly) {
          filtered = filtered.filter(p => p.isFavorite);
        }

        return filtered.sort((a, b) => {
          const timeA = new Date(a.createdAt ?? '').getTime();
          const timeB = new Date(b.createdAt ?? '').getTime();

          return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
        });
      })
    );
  }

  /**
   * Alternar favorito (mockapi requiere PUT)
   */
  toggleFavorite(id: string): Observable<RoastProfile | null> {
    return this.getProfileById(id).pipe(
      tap(profile => {
        if (!profile) throw new Error('Perfil no encontrado');
      }),
      map(profile => ({ ...profile!, isFavorite: !profile!.isFavorite })),
      // Actualiza en MockAPI
      switchMap(updated =>
        this.http.put<RoastProfile>(`${this.apiUrl}/${id}`, updated, this.httpOptions)
      ),
      catchError(this.handleError)
    );
  }

  /**
   * Obtener perfil por ID
   */
  getProfileById(id: string): Observable<RoastProfile | null> {
    return this.http.get<RoastProfile>(`${this.apiUrl}/${id}`).pipe(
      map(p => ({ ...p, createdAt: new Date(p.createdAt ?? '') })),
      catchError(() => of(null)) // si no existe, devuelve null
    );
  }

  /**
   * Crear nuevo perfil
   */
  addProfile(profile: Omit<RoastProfile, 'id' | 'createdAt'>): Observable<RoastProfile> {
    const newProfile: RoastProfile = {
      ...profile,
      createdAt: new Date().toISOString(),
      isFavorite: false
    };

    return this.http.post<RoastProfile>(this.apiUrl, newProfile, this.httpOptions)
      .pipe(catchError(this.handleError));
  }


  /**
   * Actualizar un perfil existente
   */
  updateProfile(profile: RoastProfile): Observable<RoastProfile | null> {
    return this.http.put<RoastProfile>(`${this.apiUrl}/${profile.id}`, profile, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Duplicar un perfil
   */
  duplicateProfile(id: string): Observable<RoastProfile | null> {
    return this.getProfileById(id).pipe(
      tap(profile => {
        if (!profile) throw new Error('No se pudo duplicar: perfil no encontrado');
      }),
      map(profile => ({
        ...profile!,
        id: undefined,
        name: `${profile!.name} (Copia)`,
        createdAt: new Date().toISOString(),
        isFavorite: false
      })),
      switchMap(duplicated =>
        this.http.post<RoastProfile>(this.apiUrl, duplicated, this.httpOptions)
      ),
      catchError(this.handleError)
    );
  }


  /**
   * Manejo de errores
   */
  private handleError(error: HttpErrorResponse) {
    let msg = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      msg = `Error del cliente: ${error.error.message}`;
    } else {
      msg = `Error ${error.status}: ${error.message}`;
    }
    console.error('Error API:', msg);
    return throwError(() => new Error(msg));
  }
}
