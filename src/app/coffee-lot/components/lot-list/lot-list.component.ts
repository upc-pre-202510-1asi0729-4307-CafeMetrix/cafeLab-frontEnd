import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CoffeeLotService } from '../../services/coffee-lot.service';
import { CoffeeLot } from '../../models/coffee-lot.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, finalize, of } from 'rxjs';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';
import {MatToolbar} from '@angular/material/toolbar';
import { AuthService } from '../../../auth/services/AuthService';

interface Supplier {
  id: string; // debe ser string para coincidir con supplier_id
  name: string;
  email: string;
  phone: string;
  location: string;
  user_id: string;
}
@Component({
  selector: 'app-lot-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, RouterModule, ToolbarComponent, MatToolbar],
  templateUrl: './lot-list.component.html',
  styleUrls: ['./lot-list.component.css']
})
export class LotListComponent implements OnInit {
  @ViewChild('lotForm') lotForm!: NgForm;
  @ViewChild('editForm') editForm!: NgForm;

  lots: CoffeeLot[] = [];
  suppliers: Supplier[] = [];
  searchQuery = '';
  showRegisterModal = false;
  showEditModal = false;
  showLotDetails = false;
  loading = false;
  error: string | null = null;
  newCertification = '';

  coffeeTypes = ['Arábica', 'Robusta', 'Mezcla'];
  processTypes = ['Grano Verde', 'Lavado', 'Natural', 'Honey'];
  certificationsOptions = ['Comercio Justo', 'Bird Friendly', 'UTZ certified', 'Orgánico', 'Rainforest Alliance'];

  newLot: CoffeeLot = this.getEmptyLot();
  editingLot: CoffeeLot = this.getEmptyLot();
  selectedLot: CoffeeLot | null = null;

  constructor(
    private lotService: CoffeeLotService,
    private translateService: TranslateService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadLots();
    this.loadSuppliers();
  }

  private getEmptyLot(): CoffeeLot {
    return {
      lot_name: '',
      coffee_type: '',
      processing_method: '',
      altitude: 0,
      weight: 0,
      origin: '',
      certifications: [],
      supplier_id: '',
      user_id: ''
    };
  }

  loadSuppliers(): void {
    const userId = this.authService.getCurrentUserId();

    this.http.get<Supplier[]>('https://682697d8397e48c913169c83.mockapi.io/suppliers')
      .pipe(
        catchError(err => {
          console.error('Error loading suppliers', err);
          return of([]);
        })
      )
      .subscribe(suppliers => {
        this.suppliers = suppliers.filter(s => s.user_id === userId);
      });
  }


  loadLots(): void {
    this.loading = true;
    const userId = this.authService.getCurrentUserId();

    this.lotService.getLots()
      .pipe(
        catchError(err => {
          this.error = 'Error al cargar los lotes de café.';
          return of([]);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(lots => {
        this.lots = lots.filter(lot => lot.user_id === userId);
      });
  }


  searchLots(): void {
    if (this.searchQuery.trim()) {
      this.loading = true;
      this.lotService.searchLots(this.searchQuery)
        .pipe(
          catchError(err => {
            this.error = 'Error al buscar lotes de café.';
            return of([]);
          }),
          finalize(() => this.loading = false)
        )
        .subscribe(lots => this.lots = lots);
    } else {
      this.loadLots();
    }
  }

  viewLotDetails(lot: CoffeeLot): void {
    this.selectedLot = { ...lot };
    this.showLotDetails = true;
  }

  closeLotDetails(): void {
    this.showLotDetails = false;
    this.selectedLot = null;
  }

  editLot(lot: CoffeeLot): void {
    this.editingLot = { ...lot };
    this.showEditModal = true;
    this.showLotDetails = false;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editForm?.resetForm();
  }

  registerLot(): void {
    this.error = null;

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.error = "Usuario no autenticado.";
      return;
    }

    // Validación: asegurar que haya al menos un proveedor disponible
    const userSuppliers = this.suppliers.filter(s => s.user_id === userId);
    if (userSuppliers.length === 0) {
      this.error = "Debe tener al menos un proveedor registrado para poder crear un lote.";
      return;
    }

    const requiredFields = [
      this.newLot.lot_name,
      this.newLot.coffee_type,
      this.newLot.processing_method,
      this.newLot.altitude,
      this.newLot.weight,
      this.newLot.origin,
      this.newLot.supplier_id
    ];

    if (requiredFields.some(field => !field)) {
      this.error = "Por favor complete todos los campos obligatorios";
      return;
    }

    this.newLot.user_id = userId;
    this.newLot.altitude = Number(this.newLot.altitude);
    this.newLot.weight = Number(this.newLot.weight);

    this.lotService.addLot(this.newLot)
      .subscribe({
        next: () => {
          this.loadLots();
          this.showRegisterModal = false;
          this.newLot = this.getEmptyLot();
        },
        error: (err) => this.error = err.message
      });
  }


  cancelRegister(): void {
    this.showRegisterModal = false;
    this.resetForm();
  }





  saveLotChanges(): void {
    if (
      !this.editForm?.valid ||
      !this.editingLot.lot_name ||
      !this.editingLot.coffee_type ||
      !this.editingLot.processing_method ||
      !this.editingLot.altitude ||
      !this.editingLot.weight||
      !this.editingLot.origin ||
      !this.editingLot.supplier_id
    ) {
      this.error = "Complete todos los campos obligatorios.";
      return;
    }

    this.loading = true;
    this.lotService.updateLot(this.editingLot)
      .pipe(
        catchError(err => {
          this.error = 'Error al actualizar el lote.';
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(result => {
        if (result !== null) {
          this.showEditModal = false;
          this.loadLots();
        }
      });
  }

  onSupplierChange(event: Event): void {
    this.newLot.supplier_id = (event.target as HTMLSelectElement).value;
  }

  onEditSupplierChange(event: Event): void {
    this.editingLot.supplier_id = (event.target as HTMLSelectElement).value;
  }

  addCertification(value: string): void {
    if (value.trim() && !this.newLot.certifications.includes(value)) {
      this.newLot.certifications.push(value);
      this.newCertification = '';
    }
  }

  addCertificationToEdit(value: string): void {
    if (value.trim() && !this.editingLot.certifications.includes(value)) {
      this.editingLot.certifications.push(value);
      this.newCertification = '';
    }
  }

  removeCertification(index: number): void {
    this.newLot.certifications.splice(index, 1);
  }

  removeCertificationFromEdit(index: number): void {
    this.editingLot.certifications.splice(index, 1);
  }

  getSupplierName(id: string | undefined): string {
    if (!id) return '';
    const supplier = this.suppliers.find(s => s.id === id);
    return supplier ? supplier.name : '';
  }

  resetForm(): void {
    this.newLot = this.getEmptyLot();
    this.lotForm?.resetForm();
    this.error = null;
  }
}
