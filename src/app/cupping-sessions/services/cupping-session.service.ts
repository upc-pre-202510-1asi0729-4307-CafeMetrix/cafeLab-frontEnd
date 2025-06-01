import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CuppingSession } from '../model/cupping-session.entity';

@Injectable({
  providedIn: 'root'
})
export class CuppingSessionService {
  // Simulamos data por ahora, luego se conectará a la API.
  private sesiones: CuppingSession[] = [
    {
      nombre: 'Cata Especial Primavera',
      fecha: '2024-03-15',
      origen: 'Perú',
      variedad: 'Arábica',
      favorito: false,
      loteNombre: 'Lote A - Perú Chanchamayo',
      perfilNombre: 'Perfil Ligero - City Roast',
      id: 0
    },
    {
      nombre: 'Evaluación Mensual', fecha: '2024-03-10', origen: 'Colombia', variedad: 'Caturra', favorito: true,
      id: 0
    },
    {
      nombre: 'Cata Regional Sur', fecha: '2024-03-05', origen: 'Brasil', variedad: 'Bourbon', favorito: false,
      id: 0
    },
    {
      nombre: 'Análisis Premium', fecha: '2024-02-28', origen: 'Guatemala', variedad: 'Gesha', favorito: false,
      id: 0
    },
    {
      nombre: 'Cata Orgánica', fecha: '2024-02-20', origen: 'México', variedad: 'Typica', favorito: true,
      id: 0
    }
  ];

  getCuppingSessions(): Observable<CuppingSession[]> {
    return of(this.sesiones);
  }

  toggleFavorito(sesion: CuppingSession): void {
    sesion.favorito = !sesion.favorito;
  }
}
