import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CoffeeLotService } from '../../services/coffee-lot.service';
import { CoffeeLot } from '../../model/coffee-lot.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, finalize, of } from 'rxjs';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/AuthService';
import { SupplierService } from '../../../supply/services/supplier.service';
import { Supplier } from '../../../supply/models/supplier.model';

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
  suppliers: Supplier[] = [];
  searchQuery = '';
  showRegisterModal = false;
  showEditModal = false;
  showLotDetails = false;
  showDeleteModal = false;
  loading = false;
  error: string | null = null;
  newCertification = '';

  coffeeTypes = ['Arábica', 'Robusta', 'Mezcla'];
  processTypes = ['Anaeróbico', 'Lavado', 'Natural', 'Honey'];
  certificationsOptions = ['Comercio Justo', 'Bird Friendly', 'UTZ certified', 'Orgánico', 'Rainforest Alliance'];
  statusOptions = ['green', 'roasted'];

  newLot: CoffeeLot = this.getEmptyLot();
  editingLot: CoffeeLot = this.getEmptyLot();
  selectedLot: CoffeeLot | null = null;
  lotToDelete: CoffeeLot | null = null;

  constructor(
    private lotService: CoffeeLotService,
    private supplierService: SupplierService,
    private translateService: TranslateService,
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
      supplier_id: 0,
      userId: 0,
      status: ''
    };
  }

  loadSuppliers(): void {
    this.supplierService.getAll()
      .pipe(
        catchError(err => {
          console.error('Error loading suppliers', err);
          this.error = 'Error al cargar los proveedores.';
          return of([]);
        })
      )
      .subscribe(suppliers => {
        this.suppliers = suppliers;
      });
  }

  loadLots(): void {
    this.loading = true;
    this.error = null;

    this.lotService.getAll()
      .pipe(
        catchError(err => {
          console.error('Error loading lots', err);
          this.error = 'Error al cargar los lotes de café.';
          return of([]);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(lots => {
        this.lots = lots;
      });
  }

  searchLots(): void {
    if (this.searchQuery.trim()) {
      this.loading = true;
      this.error = null;

      this.lotService.searchLots(this.searchQuery)
        .pipe(
          catchError(err => {
            console.error('Error searching lots', err);
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
    this.error = null;
  }

  closeLotDetails(): void {
    this.showLotDetails = false;
    this.selectedLot = null;
    this.error = null;
  }

  editLot(lot: CoffeeLot): void {
    this.editingLot = { ...lot };
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

  registerLot(): void {
    if (!this.lotForm?.valid || !this.newLot.lot_name || !this.newLot.coffee_type || 
        !this.newLot.processing_method || !this.newLot.altitude || !this.newLot.weight || 
        !this.newLot.origin || !this.newLot.supplier_id || !this.newLot.status) {
      this.error = "Por favor, complete todos los campos obligatorios.";
      return;
    }

    // Validar que el usuario tenga proveedores disponibles
    if (this.suppliers.length === 0) {
      this.error = "Debe tener al menos un proveedor registrado para poder crear un lote.";
      return;
    }

    this.loading = true;
    this.error = null;

    this.newLot.userId = Number(this.authService.getCurrentUserId());
    this.newLot.altitude = Number(this.newLot.altitude);
    this.newLot.weight = Number(this.newLot.weight);

    this.lotService.create(this.newLot)
      .pipe(
        catchError(err => {
          console.error('Error creating lot', err);
          this.error = 'Error al registrar el lote. Por favor intente nuevamente.';
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe((result: any) => {
        if (result !== null) {
          this.showRegisterModal = false;
          this.resetForm();
          this.loadLots();
        }
      });
  }

  cancelRegister(): void {
    this.showRegisterModal = false;
    this.resetForm();
  }

  saveLotChanges(): void {
    if (!this.editForm?.valid || !this.editingLot.id || !this.editingLot.lot_name || 
        !this.editingLot.coffee_type || !this.editingLot.processing_method || 
        !this.editingLot.altitude || !this.editingLot.weight || !this.editingLot.origin || 
        !this.editingLot.supplier_id || !this.editingLot.status) {
      this.error = "Por favor, complete todos los campos obligatorios.";
      return;
    }

    this.loading = true;
    this.error = null;

    this.lotService.update(this.editingLot.id!, this.editingLot)
      .pipe(
        catchError(err => {
          console.error('Error updating lot', err);
          this.error = 'Error al actualizar el lote. Por favor intente nuevamente.';
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe((result: any) => {
        if (result !== null) {
          this.showEditModal = false;
          this.loadLots();
        }
      });
  }

  onSupplierChange(event: Event): void {
    this.newLot.supplier_id = Number((event.target as HTMLSelectElement).value);
  }

  onEditSupplierChange(event: Event): void {
    this.editingLot.supplier_id = Number((event.target as HTMLSelectElement).value);
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

  getSupplierName(id: number | undefined): string {
    if (!id) return '';
    const supplier = this.suppliers.find(s => s.id === id);
    return supplier ? supplier.name : '';
  }

  getStatusText(status: string | undefined): string {
    if (!status) return '';
    return status === 'green' ? 
      this.translateService.instant('FORM.STATUS_OPTIONS.GREEN') : 
      this.translateService.instant('FORM.STATUS_OPTIONS.ROASTED');
  }

  deleteLot(lot: CoffeeLot): void {
    if (!lot.id) {
      this.error = 'Error: No se pudo identificar el lote a eliminar.';
      return;
    }

    this.lotToDelete = lot;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.lotToDelete?.id) {
      this.error = 'Error: No se pudo identificar el lote a eliminar.';
      return;
    }

    this.loading = true;
    this.error = null;

    this.lotService.delete(this.lotToDelete.id)
      .pipe(
        catchError(err => {
          console.error('Error deleting lot', err);
          this.error = 'Error al eliminar el lote. Por favor intente nuevamente.';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
          this.showDeleteModal = false;
          this.lotToDelete = null;
        })
      )
      .subscribe((result: any) => {
        if (result !== null) {
          this.loadLots();
        }
      });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.lotToDelete = null;
  }

  resetForm(): void {
    this.newLot = this.getEmptyLot();
    if (this.lotForm) {
      this.lotForm.resetForm();
    }
    this.error = null;
  }
}
