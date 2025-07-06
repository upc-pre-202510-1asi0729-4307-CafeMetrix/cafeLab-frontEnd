import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SupplierService } from '../../services/supplier.service';
import { Supplier } from '../../models/supplier.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, finalize, of } from 'rxjs';
import { RouterModule } from '@angular/router';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';
import {MatToolbar} from '@angular/material/toolbar';
import { AuthService} from '../../../auth/services/AuthService';

@Component({
  selector: 'app-Supplier-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, RouterModule, ToolbarComponent, MatToolbar],
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit {
  @ViewChild('supplierForm') supplierForm!: NgForm;
  @ViewChild('editForm') editForm!: NgForm;

  suppliers: Supplier[] = [];
  searchQuery: string = '';
  showRegisterModal: boolean = false;
  showEditModal: boolean = false;
  showSupplierDetails: boolean = false;

  newSpecialties: string[] = [];
  editingSpecialties: string[] = [];

  newSupplier: Supplier = {
    name: '',
    email: '',
    phone: 0,
    location: '',
    specialties: [],
    userId: 0
  };

  editingSupplier: Supplier = {
    name: '',
    email: '',
    phone: 0,
    location: '',
    specialties: [],
    userId: 0
  };

  selectedSupplier: Supplier | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private supplierService: SupplierService,
    private translateService: TranslateService,
    private authService: AuthService

  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.loading = true;
    this.error = null;

    this.supplierService.getAll()
      .pipe(
        catchError(err => {
          console.error('Error loading suppliers', err);
          this.error = 'Error al cargar los proveedores. Por favor intente nuevamente.';
          return of([]);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(suppliers => {
        this.suppliers = suppliers;
      });
  }

  searchSuppliers(): void {
    if (this.searchQuery.trim()) {
      this.loading = true;
      this.error = null;

      this.supplierService.searchSuppliers(this.searchQuery)
        .pipe(
          catchError(err => {
            console.error('Error searching suppliers', err);
            this.error = 'Error al buscar proveedores. Por favor intente nuevamente.';
            return of([]);
          }),
          finalize(() => this.loading = false)
        )
        .subscribe(suppliers => this.suppliers = suppliers);
    } else {
      this.loadSuppliers();
    }
  }

  viewSupplierDetails(supplier: Supplier): void {
    this.selectedSupplier = { ...supplier };
    this.showSupplierDetails = true;
    this.error = null;
  }

  closeSupplierDetails(): void {
    this.showSupplierDetails = false;
    this.selectedSupplier = null;
    this.error = null;
  }

  editSupplier(supplier: Supplier): void {
    this.editingSupplier = { ...supplier };
    this.editingSpecialties = [...supplier.specialties];
    this.showEditModal = true;
    this.showSupplierDetails = false;
    this.error = null;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.error = null;
    this.editingSpecialties = [];
    if (this.editForm) {
      this.editForm.resetForm();
    }
  }

  saveSupplierChanges(): void {
    if (!this.editForm?.valid || !this.editingSupplier.id) {
      this.error = "Por favor, complete todos los campos obligatorios.";
      return;
    }

    // Validar que el teléfono sea un número válido
    if (isNaN(this.editingSupplier.phone) || this.editingSupplier.phone <= 0) {
      this.error = "Por favor, ingrese un número de teléfono válido.";
      return;
    }

    this.loading = true;
    this.error = null;

    // Asignar las especialidades del array temporal
    this.editingSupplier.specialties = [...this.editingSpecialties];


    this.supplierService.update(this.editingSupplier.id!, this.editingSupplier)
      .pipe(
        catchError(err => {
          console.error('Error updating supplier', err);
          this.error = 'Error al actualizar el proveedor. Por favor intente nuevamente.';
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe((result: any) => {
        if (result !== null) {
          this.showEditModal = false;
          this.loadSuppliers();
        }
      });
  }
  deleteSupplier(id: number): void {
    if (!confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.supplierService.delete(id)
      .pipe(
        catchError(err => {
          console.error('Error deleting supplier', err);
          this.error = 'Error al eliminar el proveedor. Por favor intente nuevamente.';
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe((result: any) => {
        if (result !== null) {
          this.loadSuppliers();
        }
      });
  }


  registerSupplier(): void {
    if (!this.supplierForm?.valid || !this.newSupplier.name || !this.newSupplier.email || !this.newSupplier.phone || !this.newSupplier.location) {
      this.error = "Por favor, complete todos los campos obligatorios.";
      return;
    }

    // Validar que el teléfono sea un número válido
    if (isNaN(this.newSupplier.phone) || this.newSupplier.phone <= 0) {
      this.error = "Por favor, ingrese un número de teléfono válido.";
      return;
    }

    this.loading = true;
    this.error = null;

    this.newSupplier.userId = Number(this.getCurrentUserId());

    // Asignar las especialidades del array temporal
    this.newSupplier.specialties = [...this.newSpecialties];


    this.supplierService.create(this.newSupplier)
      .pipe(
        catchError(err => {
          console.error('Error adding supplier', err);
          this.error = 'Error al registrar el proveedor. Por favor intente nuevamente.';
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe((result: any) => {
        if (result !== null) {
          this.showRegisterModal = false;
          this.resetForm();
          this.loadSuppliers();
        }
      });
  }

  addNewSpecialty(specialtyInput: HTMLInputElement): void {
    const specialty = specialtyInput.value.trim();
    if (specialty && this.newSpecialties.length < 4 && !this.newSpecialties.includes(specialty)) {
      this.newSpecialties.push(specialty);
      specialtyInput.value = '';
    } else if (this.newSpecialties.length >= 4) {
      this.error = 'Máximo 4 especialidades permitidas.';
    } else if (this.newSpecialties.includes(specialty)) {
      this.error = 'Esta especialidad ya está agregada.';
    }
  }

  removeNewSpecialty(index: number): void {
    this.newSpecialties.splice(index, 1);
  }

  addEditSpecialty(specialtyInput: HTMLInputElement): void {
    const specialty = specialtyInput.value.trim();
    if (specialty && this.editingSpecialties.length < 4 && !this.editingSpecialties.includes(specialty)) {
      this.editingSpecialties.push(specialty);
      specialtyInput.value = '';
    } else if (this.editingSpecialties.length >= 4) {
      this.error = 'Máximo 4 especialidades permitidas.';
    } else if (this.editingSpecialties.includes(specialty)) {
      this.error = 'Esta especialidad ya está agregada.';
    }
  }

  removeEditSpecialty(index: number): void {
    this.editingSpecialties.splice(index, 1);
  }



  resetForm(): void {
    this.newSupplier = {
      name: '',
      email: '',
      phone: 0,
      location: '',
      specialties: [],
      userId: 0
    };

    this.newSpecialties = [];

    if (this.supplierForm) {
      this.supplierForm.resetForm();
    }

    this.error = null;
  }
  private getCurrentUserId(): string {
    return this.authService.getCurrentUserId();
  }



}
