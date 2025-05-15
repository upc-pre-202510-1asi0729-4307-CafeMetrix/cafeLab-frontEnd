import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RoastProfile } from '../models/roast-profile.model';

@Injectable({
  providedIn: 'root'
})
export class RoastProfileService {
  // Datos de prueba (simulando una base de datos)
  private roastProfiles: RoastProfile[] = [
    {
      id: '1',
      name: 'Perfil Clásico',
      type: 'Medio',
      altitude: '1200-1500 msnm',
      provider: 'Finca Los Alpes',
      isFavorite: true,
      createdAt: new Date('2023-05-10')
    },
    {
      id: '2',
      name: 'Tueste Oscuro Premium',
      type: 'Oscuro',
      altitude: '1800-2000 msnm',
      provider: 'Cooperativa Sierra Nevada',
      isFavorite: false,
      createdAt: new Date('2023-06-15')
    },
    {
      id: '3',
      name: 'Tueste Ligero Frutal',
      type: 'Ligero',
      altitude: '1600-1800 msnm',
      provider: 'Finca Santa Clara',
      isFavorite: true,
      createdAt: new Date('2023-07-22')
    },
    {
      id: '4',
      name: 'Especial Montaña',
      type: 'Medio-Oscuro',
      altitude: '1900-2100 msnm',
      provider: 'Productores Unidos',
      isFavorite: false,
      createdAt: new Date('2023-08-05')
    }
  ];

  constructor() { }

  getRoastProfiles(): Observable<RoastProfile[]> {
    return of(this.roastProfiles);
  }

  searchRoastProfiles(query: string): Observable<RoastProfile[]> {
    const normalizedQuery = query.toLowerCase().trim();
    const filteredProfiles = this.roastProfiles.filter(profile => 
      profile.name.toLowerCase().includes(normalizedQuery) ||
      profile.type.toLowerCase().includes(normalizedQuery) ||
      profile.provider.toLowerCase().includes(normalizedQuery)
    );
    return of(filteredProfiles);
  }

  filterProfiles(showFavoritesOnly: boolean, sortOrder: 'asc' | 'desc'): Observable<RoastProfile[]> {
    let filteredProfiles = [...this.roastProfiles];
    
    // Filtrar por favoritos si es necesario
    if (showFavoritesOnly) {
      filteredProfiles = filteredProfiles.filter(profile => profile.isFavorite);
    }
    
    // Ordenar por fecha
    filteredProfiles.sort((a, b) => {
      const dateA = a.createdAt?.getTime() || 0;
      const dateB = b.createdAt?.getTime() || 0;
      
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    return of(filteredProfiles);
  }

  toggleFavorite(id: string): Observable<RoastProfile | null> {
    const index = this.roastProfiles.findIndex(profile => profile.id === id);
    if (index !== -1) {
      this.roastProfiles[index].isFavorite = !this.roastProfiles[index].isFavorite;
      return of(this.roastProfiles[index]);
    }
    return of(null);
  }

  getProfileById(id: string): Observable<RoastProfile | null> {
    const profile = this.roastProfiles.find(p => p.id === id);
    return of(profile || null);
  }

  addProfile(profile: Omit<RoastProfile, 'id' | 'createdAt'>): Observable<RoastProfile> {
    const newProfile: RoastProfile = {
      ...profile,
      id: Date.now().toString(), // Generar un ID único basado en timestamp
      createdAt: new Date(),
      isFavorite: false
    };
    
    this.roastProfiles.push(newProfile);
    return of(newProfile);
  }

  updateProfile(profile: RoastProfile): Observable<RoastProfile | null> {
    const index = this.roastProfiles.findIndex(p => p.id === profile.id);
    if (index !== -1) {
      this.roastProfiles[index] = { ...this.roastProfiles[index], ...profile };
      return of(this.roastProfiles[index]);
    }
    return of(null);
  }

  duplicateProfile(id: string): Observable<RoastProfile | null> {
    const profileToDuplicate = this.roastProfiles.find(p => p.id === id);
    if (!profileToDuplicate) return of(null);
    
    const duplicatedProfile: RoastProfile = {
      ...profileToDuplicate,
      id: Date.now().toString(),
      name: `${profileToDuplicate.name} (Copia)`,
      createdAt: new Date(),
      isFavorite: false
    };
    
    this.roastProfiles.push(duplicatedProfile);
    return of(duplicatedProfile);
  }
} 