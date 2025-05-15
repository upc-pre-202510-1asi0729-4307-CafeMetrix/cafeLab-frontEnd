import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CoffeeLotService } from '../../services/coffee-lot.service';
import { CoffeeLot } from '../../models/coffee-lot.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, finalize, of } from 'rxjs';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Provider {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
}

@Component({
  selector: 'app-lot-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, RouterModule],
  templateUrl: './lot-list.component.html',
  styleUrls: ['./lot-list.component.css']
})
export class LotListComponent implements OnInit {
  @ViewChild('lotForm') lotForm!: NgForm;
  @ViewChild('editForm') editForm!: NgForm;
  
  lots: CoffeeLot[] = [];
  providers: Provider[] = [];
  searchQuery: string = '';
  showRegisterModal: boolean = false;
  showEditModal: boolean = false;
  showLotDetails: boolean = false;
  
  newLot: CoffeeLot = {
    name: '',
    type: '',
    process: '',
    altitude: '',
    weight: '',
    origin: '',
    certifications: [],
    providerId: undefined,
    providerName: ''
  };
  
  selectedLot: CoffeeLot | null = null;
  editingLot: CoffeeLot = {
    name: '',
    type: '',
    process: '',
    altitude: '',
    weight: '',
    origin: '',
    certifications: [],
    providerId: undefined,
    providerName: ''
  };
  
  loading: boolean = false;
  error: string | null = null;
  
  // Lista de opciones para seleccionar
  coffeeTypes = ['Arábica', 'Robusta', 'Mezcla'];
  processTypes = ['Grano Verde', 'Lavado', 'Natural', 'Honey'];
  certificationsOptions = ['Comercio Justo', 'Bird Friendly', 'UTZ certified', 'Orgánico', 'Rainforest Alliance'];
  
  // Para manejar certificaciones
  newCertification: string = '';

  constructor(
    private lotService: CoffeeLotService,
    private translateService: TranslateService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadLots();
    this.loadProviders();
  }

  loadProviders(): void {
    this.http.get<Provider[]>('http://localhost:3000/providers')
      .pipe(
        catchError(err => {
          console.error('Error loading providers', err);
          return of([]);
        })
      )
      .subscribe(providers => {
        this.providers = providers;
        console.log('Providers loaded:', providers);
      });
  }

  loadLots(): void {
    this.loading = true;
    this.error = null;
    this.lotService.getLots()
      .pipe(
        catchError(err => {
          console.error('Error loading coffee lots', err);
          this.error = 'Error al cargar los lotes de café. Por favor intente nuevamente.';
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(lots => {
        this.lots = lots;
        console.log('Coffee lots loaded:', lots);
      });
  }

  searchLots(): void {
    if (this.searchQuery.trim()) {
      this.loading = true;
      this.error = null;
      this.lotService.searchLots(this.searchQuery)
        .pipe(
          catchError(err => {
            console.error('Error searching coffee lots', err);
            this.error = 'Error al buscar lotes de café. Por favor intente nuevamente.';
            return of([]);
          }),
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(lots => {
          this.lots = lots;
        });
    } else {
      this.loadLots();
    }
  }

  viewLotDetails(lot: CoffeeLot): void {
    this.selectedLot = {...lot};
    this.showLotDetails = true;
    this.error = null;
  }

  closeLotDetails(): void {
    this.showLotDetails = false;
    this.selectedLot = null;
  }

  editLot(lot: CoffeeLot): void {
    this.editingLot = {...lot};
    this.showEditModal = true;
    this.showLotDetails = false;
    this.error = null;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.error = null;
    if (this.editForm) {
      this.editForm.resetForm();
    }
  }

  onProviderChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const providerId = Number(selectElement.value);
    
    if (providerId) {
      const selectedProvider = this.providers.find(p => p.id === providerId);
      if (selectedProvider) {
        this.newLot.providerId = providerId;
        this.newLot.providerName = selectedProvider.name;
      }
    } else {
      this.newLot.providerId = undefined;
      this.newLot.providerName = '';
    }
  }

  onEditProviderChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const providerId = Number(selectElement.value);
    
    if (providerId) {
      const selectedProvider = this.providers.find(p => p.id === providerId);
      if (selectedProvider) {
        this.editingLot.providerId = providerId;
        this.editingLot.providerName = selectedProvider.name;
      }
    } else {
      this.editingLot.providerId = undefined;
      this.editingLot.providerName = '';
    }
  }

  saveLotChanges(): void {
    if (!this.editForm?.valid || !this.editingLot.id || 
        !this.editingLot.name || !this.editingLot.type || 
        !this.editingLot.process || !this.editingLot.altitude || 
        !this.editingLot.weight || !this.editingLot.origin ||
        !this.editingLot.providerId) {
      this.error = "Por favor, complete todos los campos obligatorios, incluyendo el proveedor.";
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    this.lotService.updateLot(this.editingLot)
      .pipe(
        catchError(err => {
          console.error('Error updating coffee lot', err);
          this.error = 'Error al actualizar el lote de café. Por favor intente nuevamente.';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(result => {
        if (result !== null) {
          this.showEditModal = false;
          this.loadLots();
        }
      });
  }

  registerLot(): void {
    console.log('Form submission attempted');
    console.log('Form valid:', this.lotForm?.valid);
    console.log('Form values:', this.newLot);
    
    if (!this.lotForm?.valid || 
        !this.newLot.name || !this.newLot.type || 
        !this.newLot.process || !this.newLot.altitude || 
        !this.newLot.weight || !this.newLot.origin ||
        !this.newLot.providerId) {
      this.error = "Por favor, complete todos los campos obligatorios, incluyendo el proveedor.";
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    // Crear una copia del objeto para evitar referencias
    const lotToAdd = {
      name: this.newLot.name,
      type: this.newLot.type,
      process: this.newLot.process,
      altitude: this.newLot.altitude,
      weight: this.newLot.weight,
      origin: this.newLot.origin,
      certifications: [...this.newLot.certifications],
      providerId: this.newLot.providerId,
      providerName: this.newLot.providerName
    };
    
    console.log('Sending coffee lot data:', lotToAdd);
    
    this.lotService.addLot(lotToAdd)
      .pipe(
        catchError(err => {
          console.error('Error adding coffee lot', err);
          this.error = 'Error al registrar el lote de café. Por favor intente nuevamente.';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(result => {
        console.log('Coffee lot add result:', result);
        if (result !== null) {
          this.showRegisterModal = false;
          // Reiniciar el formulario
          this.resetForm();
          // Cargar los lotes actualizados
          this.loadLots();
        }
      });
  }

  addCertification(certificationValue: string): void {
    if (certificationValue.trim() && 
        !this.newLot.certifications.includes(certificationValue)) {
      this.newLot.certifications.push(certificationValue);
      this.newCertification = '';
    }
  }

  addCertificationToEdit(certificationValue: string): void {
    if (certificationValue.trim() && 
        !this.editingLot.certifications.includes(certificationValue)) {
      this.editingLot.certifications.push(certificationValue);
      this.newCertification = '';
    }
  }

  removeCertification(index: number): void {
    this.newLot.certifications.splice(index, 1);
  }

  removeCertificationFromEdit(index: number): void {
    this.editingLot.certifications.splice(index, 1);
  }
  
  resetForm(): void {
    this.newLot = {
      name: '',
      type: '',
      process: '',
      altitude: '',
      weight: '',
      origin: '',
      certifications: [],
      providerId: undefined,
      providerName: ''
    };
    
    if (this.lotForm) {
      this.lotForm.resetForm();
    }
    
    this.error = null;
  }
} 