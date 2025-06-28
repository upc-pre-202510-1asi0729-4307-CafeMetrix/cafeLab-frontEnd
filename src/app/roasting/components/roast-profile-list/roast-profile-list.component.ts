import { Component, OnInit, ViewChild } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RoastProfileService } from '../../services/roast-profile.service';
import { RoastProfile } from '../../models/roast-profile.model';
import { catchError, finalize, of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import {CoffeeLot} from '../../../coffee-lot/model/coffee-lot.model';
import {CoffeeLotService} from '../../../coffee-lot/services/coffee-lot.service';
import {Router} from '@angular/router';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';
import {MatToolbar} from '@angular/material/toolbar';
import {AuthService} from '../../../auth/services/AuthService';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-roast-profile-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule, ToolbarComponent, MatToolbar, NgOptimizedImage],
  templateUrl: './roast-profile-list.component.html',
  styleUrls: ['./roast-profile-list.component.css']
})
export class RoastProfileListComponent implements OnInit {
  @ViewChild('profileForm') profileForm!: NgForm;
  @ViewChild('editForm') editForm!: NgForm;
  @ViewChild('roastCurveCanvas') roastCurveCanvas: any;


  coffeeLots: CoffeeLot[] = [];
  profiles: RoastProfile[] = [];
  searchQuery: string = '';
  showProfileDetails: boolean = false;
  showEditModal: boolean = false;
  showRegisterModal: boolean = false;

  selectedProfile: RoastProfile | null = null;
  editingProfile: RoastProfile | null = null;

  newProfile: RoastProfile = {
    name: '',
    type: '',
    duration: 0,
    lot: '',
    tempStart: 0,
    tempEnd: 0
  };


  loading: boolean = false;
  error: string | null = null;

  showFavoritesOnly: boolean = false;
  sortOrder: 'asc' | 'desc' = 'desc';

  roastTypes: string[] = ['Ligero', 'Medio', 'Medio-Oscuro', 'Oscuro'];

  constructor(
    private roastProfileService: RoastProfileService,
    private coffeeLotService: CoffeeLotService,
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService

  ) { }

  ngOnInit(): void {
    this.loadProfiles();
    this.loadCoffeeLots(); // <-- nuevo
  }

  loadProfiles(): void {
    this.loading = true;
    this.error = null;

    const userId = this.authService.getCurrentUserId();

    this.roastProfileService.getRoastProfiles()
      .pipe(
        catchError(err => {
          console.error('Error loading profiles', err);
          this.error = 'Error al cargar los perfiles de tueste. Por favor intente nuevamente.';
          return of([]);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(profiles => {
        this.profiles = profiles.filter(profile => profile.user_id === userId);
      });
  }


  searchProfiles(): void {
    if (this.searchQuery.trim()) {
      this.loading = true;
      this.error = null;

      const userId = this.authService.getCurrentUserId();

      this.roastProfileService.searchRoastProfiles(this.searchQuery, userId)
        .pipe(
          catchError(err => {
            console.error('Error searching profiles', err);
            this.error = 'Error al buscar perfiles. Por favor intente nuevamente.';
            return of([]);
          }),
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(profiles => {
          this.profiles = profiles;
        });
    } else {
      this.loadProfiles();
    }
  }


  applyFilters(): void {
    this.loading = true;
    this.error = null;

    const userId = this.authService.getCurrentUserId();

    this.roastProfileService.filterProfiles(userId, this.showFavoritesOnly, this.sortOrder)
      .pipe(
        catchError(err => {
          console.error('Error filtering profiles', err);
          this.error = 'Error al filtrar perfiles. Por favor intente nuevamente.';
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(profiles => {
        this.profiles = profiles;
      });
  }


  toggleFavorite(profile: RoastProfile, event: Event): void {
    event.stopPropagation(); // Prevenir que se abra el detalle
    if (!profile.id) return;

    this.roastProfileService.toggleFavorite(profile.id)
      .pipe(
        catchError(err => {
          console.error('Error toggling favorite', err);
          return of(null);
        })
      )
      .subscribe(result => {
        if (result) {
          // Actualiza el perfil en la lista local
          const index = this.profiles.findIndex(p => p.id === profile.id);
          if (index !== -1) {
            this.profiles[index].isFavorite = result.isFavorite;
          }
        }
      });
  }

  viewProfileDetails(profile: RoastProfile): void {
    this.selectedProfile = { ...profile };
    this.showProfileDetails = true;
    this.error = null;

    // Espera un poco a que el canvas esté en el DOM
    setTimeout(() => {
      this.drawRoastCurve();
    }, 0);
  }


  closeProfileDetails(): void {
    this.showProfileDetails = false;
    this.selectedProfile = null;
  }

  editProfile(profile: RoastProfile): void {
    this.editingProfile = {...profile};
    this.showEditModal = true;
    this.showProfileDetails = false;
    this.error = null;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.error = null;
    if (this.editForm) {
      this.editForm.resetForm();
    }
  }

  saveProfileChanges(): void {
    if (!this.editForm?.valid || !this.editingProfile) {
      this.error = "Por favor, complete todos los campos obligatorios.";
      return;
    }

    this.loading = true;
    this.error = null;

    this.roastProfileService.updateProfile(this.editingProfile)
      .pipe(
        catchError(err => {
          console.error('Error updating profile', err);
          this.error = 'Error al actualizar el perfil de tueste. Por favor intente nuevamente.';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(result => {
        if (result !== null) {
          this.showEditModal = false;
          this.loadProfiles();
        }
      });
  }

  duplicateProfile(profile: RoastProfile, event: Event): void {
    event.stopPropagation(); // Prevenir que se abra el detalle
    if (!profile.id) return;

    this.loading = true;
    this.error = null;

    this.roastProfileService.duplicateProfile(profile.id)
      .pipe(
        catchError(err => {
          console.error('Error duplicating profile', err);
          this.error = 'Error al duplicar el perfil. Por favor intente nuevamente.';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(result => {
        if (result) {
          this.profiles = [...this.profiles, result];
        }
      });
  }

  registerProfile(): void {
    if (!this.profileForm?.valid) {
      this.error = "Por favor, complete todos los campos obligatorios.";
      return;
    }

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.error = "Usuario no autenticado.";
      return;
    }

    this.newProfile.user_id = userId;

    this.loading = true;
    this.error = null;

    this.roastProfileService.addProfile(this.newProfile)
      .pipe(
        catchError(err => {
          console.error('Error registering profile', err);
          this.error = 'Error al registrar el perfil de tueste. Por favor intente nuevamente.';
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(result => {
        if (result !== null) {
          this.showRegisterModal = false;
          this.resetForm();
          this.loadProfiles();
        }
      });
  }

  resetForm(): void {
    this.newProfile = {
      name: '',
      type: '',
      duration: 0,
      lot: '',
      tempStart: 0,
      tempEnd: 0
    };

    if (this.profileForm) {
      this.profileForm.resetForm();
    }

    this.error = null;
  }

  toggleShowFavorites(): void {
    this.showFavoritesOnly = !this.showFavoritesOnly;
    this.applyFilters();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  compareProfiles(): void {
    this.router.navigate(['/compare-profile']);
  }

  loadCoffeeLots(): void {
    const userId = this.authService.getCurrentUserId();

    this.coffeeLotService.getLots()
      .pipe(
        catchError(err => {
          console.error('Error loading coffee lots-page', err);
          return of([]);
        })
      )
      .subscribe((lots: CoffeeLot[]) => {
        this.coffeeLots = lots.filter(lot => lot.user_id === userId);
      });
  }
  drawRoastCurve(): void {
    if (!this.selectedProfile || !this.roastCurveCanvas) {
      return;
    }

    const canvas: HTMLCanvasElement = this.roastCurveCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const duration = this.selectedProfile.duration;
    const tempStart = this.selectedProfile.tempStart;
    const tempEnd = this.selectedProfile.tempEnd;

    const padding = 70;
    const graphWidth = canvas.width - padding * 2;
    const graphHeight = canvas.height - padding * 2;

    const timeToX = (t: number) => padding + (t / duration) * graphWidth;
    const tempToY = (temp: number) =>
      canvas.height - padding - ((temp - tempStart) / (tempEnd - tempStart)) * graphHeight;

    // --- Dibujar fondo y grilla ---
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;

    const xSteps = 10;
    const ySteps = 10;

    // Grilla vertical
    for (let i = 0; i <= xSteps; i++) {
      const t = (i / xSteps) * duration;
      const x = timeToX(t);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvas.height - padding);
      ctx.stroke();
    }

    // Grilla horizontal
    for (let i = 0; i <= ySteps; i++) {
      const temp = tempStart + (i / ySteps) * (tempEnd - tempStart);
      const y = tempToY(temp);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    // --- Dibujar ejes ---
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(padding, padding);
    ctx.stroke();

    // --- Etiquetas eje X ---
    ctx.font = '14px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    for (let i = 0; i <= xSteps; i++) {
      const t = (i / xSteps) * duration;
      const x = timeToX(t);
      ctx.fillText(
        `${t.toFixed(1)} ${this.translate.instant('comparison.minutos')}`,
        x,
        canvas.height - padding + 20
      );
    }

    // --- Etiquetas eje Y ---
    ctx.textAlign = 'right';
    for (let i = 0; i <= ySteps; i++) {
      const temp = tempStart + (i / ySteps) * (tempEnd - tempStart);
      const y = tempToY(temp);
      ctx.fillText(
        `${temp.toFixed(0)} ${this.translate.instant('comparison.gradosCelsius')}`,
        padding - 10,
        y + 5
      );
    }

    // --- Título ---
    ctx.textAlign = 'center';
    ctx.font = '18px Arial';
    ctx.fillText(
      this.translate.instant('comparison.graficoTitulo2'),
      canvas.width / 2,
      padding / 2
    );

    // --- Dibujar curvas ---
    const steps = 100;
    ctx.lineWidth = 3;

    // Temperatura del grano
    ctx.strokeStyle = '#8e44ad';
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * duration;
      const temp = tempStart + (tempEnd - tempStart) * Math.log1p(t) / Math.log1p(duration);
      const x = timeToX(t);
      const y = tempToY(temp);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Temperatura del tambor
    ctx.strokeStyle = '#c0392b';
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * duration;
      const temp = tempStart + (tempEnd - tempStart) * 0.8 * Math.log1p(t + 2) / Math.log1p(duration + 2);
      const x = timeToX(t);
      const y = tempToY(temp);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // --- Dibujar líneas de eventos ---
    const firstCrackTime = duration * 0.7;
    const secondCrackTime = duration * 0.9;

    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);

    // First Crack
    ctx.strokeStyle = '#f1c40f';
    ctx.beginPath();
    ctx.moveTo(timeToX(firstCrackTime), padding);
    ctx.lineTo(timeToX(firstCrackTime), canvas.height - padding);
    ctx.stroke();

    // Second Crack
    ctx.strokeStyle = '#e74c3c';
    ctx.beginPath();
    ctx.moveTo(timeToX(secondCrackTime), padding);
    ctx.lineTo(timeToX(secondCrackTime), canvas.height - padding);
    ctx.stroke();

    ctx.setLineDash([]);

    // --- Dibujar leyenda ---
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';

    const legendX = canvas.width - padding - 200;
    const legendY = padding + 20;
    const lineHeight = 20;

    const legendItems = [
      { color: '#8e44ad', label: this.translate.instant('comparison.temperaturaGrano') },
      { color: '#c0392b', label: this.translate.instant('comparison.temperaturaTambor') },
      { color: '#f1c40f', label: this.translate.instant('comparison.firstCrack') },
      { color: '#e74c3c', label: this.translate.instant('comparison.secondCrack') },
    ];

    legendItems.forEach((item, index) => {
      ctx.strokeStyle = item.color;
      ctx.beginPath();
      ctx.moveTo(legendX, legendY + index * lineHeight);
      ctx.lineTo(legendX + 30, legendY + index * lineHeight);
      ctx.stroke();

      ctx.fillStyle = '#000';
      ctx.fillText(item.label, legendX + 40, legendY + index * lineHeight + 5);
    });
  }

  goToHome(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    if (user.home) {
      this.router.navigate([user.home]);
      return;
    }
    switch (user.plan) {
      case 'barista':
        this.router.navigate(['/dashboard/barista']);
        break;
      case 'owner':
        this.router.navigate(['/dashboard/owner']);
        break;
      case 'full':
        this.router.navigate(['/dashboard/complete']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  refreshRoastProfiles(): void {
    window.location.reload();
  }
}
