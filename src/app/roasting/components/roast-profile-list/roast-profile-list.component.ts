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
      this.roastProfileService.searchRoastProfiles(this.searchQuery)
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
    this.roastProfileService.filterProfiles(this.showFavoritesOnly, this.sortOrder)
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
    this.selectedProfile = {...profile};
    this.showProfileDetails = true;
    this.error = null;
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
          // Añadir el nuevo perfil duplicado a la lista
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


}
