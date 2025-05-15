import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ProviderService } from '../../services/provider.service';
import { Provider } from '../../models/provider.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, finalize, of } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-provider-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, RouterModule],
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.css']
})
export class ProviderListComponent implements OnInit {
  @ViewChild('providerForm') providerForm!: NgForm;
  @ViewChild('editForm') editForm!: NgForm;
  
  providers: Provider[] = [];
  searchQuery: string = '';
  showRegisterModal: boolean = false;
  showEditModal: boolean = false;
  showProviderDetails: boolean = false;
  
  newProvider: Provider = {
    name: '',
    email: '',
    phone: '',
    location: ''
  };
  
  selectedProvider: Provider | null = null;
  editingProvider: Provider = {
    name: '',
    email: '',
    phone: '',
    location: ''
  };
  
  loading: boolean = false;
  error: string | null = null;
  modalError: string | null = null;

  constructor(
    private providerService: ProviderService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.loadProviders();
  }

  loadProviders(): void {
    this.loading = true;
    this.error = null;
    this.providerService.getProviders()
      .pipe(
        catchError(err => {
          console.error('Error loading providers', err);
          this.error = 'Error al cargar los proveedores. Por favor intente nuevamente.';
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(providers => {
        this.providers = providers;
        console.log('Providers loaded:', providers);
      });
  }

  searchProviders(): void {
    if (this.searchQuery.trim()) {
      this.loading = true;
      this.error = null;
      this.providerService.searchProviders(this.searchQuery)
        .pipe(
          catchError(err => {
            console.error('Error searching providers', err);
            this.error = 'Error al buscar proveedores. Por favor intente nuevamente.';
            return of([]);
          }),
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(providers => {
          this.providers = providers;
        });
    } else {
      this.loadProviders();
    }
  }

  viewProviderDetails(provider: Provider): void {
    this.selectedProvider = {...provider};
    this.showProviderDetails = true;
    this.error = null;
  }

  closeProviderDetails(): void {
    this.showProviderDetails = false;
    this.selectedProvider = null;
  }

  editProvider(provider: Provider): void {
    this.editingProvider = {...provider};
    this.showEditModal = true;
    this.showProviderDetails = false;
    this.error = null;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.error = null;
    if (this.editForm) {
      this.editForm.resetForm();
    }
  }

  saveProviderChanges(): void {
    if (!this.editForm?.valid || !this.editingProvider.id) {
      this.error = "Por favor, complete todos los campos obligatorios.";
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    this.providerService.updateProvider(this.editingProvider)
      .pipe(
        catchError(err => {
          console.error('Error updating provider', err);
          this.error = 'Error al actualizar el proveedor. Por favor intente nuevamente.';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(result => {
        if (result !== null) {
          this.showEditModal = false;
          this.loadProviders();
        }
      });
  }

  registerProvider(): void {
    console.log('Form submission attempted');
    console.log('Form valid:', this.providerForm?.valid);
    console.log('Form values:', this.newProvider);
    
    if (!this.providerForm?.valid || !this.newProvider.name || !this.newProvider.email || !this.newProvider.phone || !this.newProvider.location) {
      this.error = "Por favor, complete todos los campos obligatorios.";
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    // Crear una copia del objeto para evitar referencias
    const providerToAdd = {
      name: this.newProvider.name,
      email: this.newProvider.email,
      phone: this.newProvider.phone,
      location: this.newProvider.location
    };
    
    console.log('Sending provider data:', providerToAdd);
    
    this.providerService.addProvider(providerToAdd)
      .pipe(
        catchError(err => {
          console.error('Error adding provider', err);
          this.error = 'Error al registrar el proveedor. Por favor intente nuevamente.';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(result => {
        console.log('Provider add result:', result);
        if (result !== null) {
          this.showRegisterModal = false;
          // Reiniciar el formulario
          this.resetForm();
          // Cargar los proveedores actualizado
          this.loadProviders();
        }
      });
  }
  
  resetForm(): void {
    this.newProvider = {
      name: '',
      email: '',
      phone: '',
      location: ''
    };
    
    if (this.providerForm) {
      this.providerForm.resetForm();
    }
    
    this.error = null;
  }
} 