import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { RoastProfile } from '../models/roast-profile.model';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/AuthService';
import { Observable, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoastProfileService extends BaseService<RoastProfile> {
  constructor(private authService: AuthService) {
    super();
    this.resourceEndpoint = environment.roastProfileEndpointPath;
  }

  override getAll(): Observable<Array<RoastProfile>> {
    return super.getAll().pipe(
      map(profiles => profiles
        .filter(profile => profile.userId === Number(this.authService.getCurrentUserId()))
        .map(p => ({
          ...p,
          createdAt: new Date(p.createdAt ?? '')
        }))
      )
    );
  }

  override create(profile: RoastProfile): Observable<RoastProfile> {
    profile.userId = Number(this.authService.getCurrentUserId());
    profile.createdAt = new Date().toISOString();
    profile.isFavorite = false;
    
    console.log('=== ROAST PROFILE CREATE DEBUG ===');
    console.log('Profile to send:', profile);
    console.log('Current user ID:', this.authService.getCurrentUserId());
    console.log('User ID as number:', profile.userId);
    console.log('=== END DEBUG ===');
    
    return super.create(profile);
  }

  override update(id: any, profile: RoastProfile): Observable<RoastProfile> {
    profile.userId = Number(this.authService.getCurrentUserId());
    return super.update(id, profile);
  }

  searchRoastProfiles(query: string): Observable<RoastProfile[]> {
    return this.getAll().pipe(
      map(profiles => {
        const normalizedQuery = query.toLowerCase().trim();
        return profiles.filter(profile =>
          profile.name.toLowerCase().includes(normalizedQuery) ||
          profile.type.toLowerCase().includes(normalizedQuery) ||
          profile.lot.toString().includes(normalizedQuery)
        );
      })
    );
  }

  filterProfiles(showFavoritesOnly: boolean, sortOrder: 'asc' | 'desc'): Observable<RoastProfile[]> {
    return this.getAll().pipe(
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

  toggleFavorite(id: number): Observable<RoastProfile> {
    return this.getById(id).pipe(
      map(profile => ({ ...profile, isFavorite: !profile.isFavorite })),
      switchMap(updated => this.update(id, updated))
    );
  }

  duplicateProfile(id: number): Observable<RoastProfile> {
    return this.getById(id).pipe(
      map(profile => ({
        ...profile,
        id: undefined,
        name: `${profile.name} (Copia)`,
        createdAt: new Date().toISOString(),
        isFavorite: false
      })),
      switchMap(duplicated => this.create(duplicated))
    );
  }

  override delete(id: number): Observable<any> {
    return super.delete(id);
  }
}
