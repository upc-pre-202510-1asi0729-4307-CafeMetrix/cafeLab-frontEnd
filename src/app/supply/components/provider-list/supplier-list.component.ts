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
    user_id: ''
  };

  editingSupplier: Supplier = {
    name: '',
    email: '',
    phone: 0,
    location: '',
    specialties: [],
    user_id: ''
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

    this.supplierService.getSuppliers()
      .pipe(
        catchError(err => {
          console.error('Error loading suppliers', err);
          this.error = 'Error al cargar los proveedores. Por favor intente nuevamente.';
          return of([]);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(suppliers => {
        const currentUserId = this.getCurrentUserId();
        this.suppliers = suppliers.filter(supplier => supplier.user_id === currentUserId);
      });  }

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
    if (this.editForm) {
      this.editForm.resetForm();
    }
  }

  saveSupplierChanges(): void {
    if (!this.editForm?.valid || !this.editingSupplier.id) {
      this.error = "Por favor, complete todos los campos obligatorios.";
      return;
    }

    this.loading = true;
    this.error = null;

    this.editingSupplier.specialties = [...this.editingSpecialties];


    this.supplierService.updateSupplier(this.editingSupplier)
      .pipe(
        catchError(err => {
          console.error('Error updating supplier', err);
          this.error = 'Error al actualizar el proveedor. Por favor intente nuevamente.';
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(result => {
        if (result !== null) {
          this.showEditModal = false;
          this.loadSuppliers();
        }
      });
  }
  deleteSupplier(id: string): void {
    if (!confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.supplierService.deleteSupplier(id)
      .pipe(
        catchError(err => {
          console.error('Error deleting supplier', err);
          this.error = 'Error al eliminar el proveedor. Por favor intente nuevamente.';
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(result => {
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

    this.loading = true;
    this.error = null;

    this.newSupplier.user_id = this.getCurrentUserId();

    // Elimina elementos vacíos del arreglo
    this.newSupplier.specialties = [...this.newSpecialties];


    this.supplierService.addSupplier(this.newSupplier)
      .pipe(
        catchError(err => {
          console.error('Error adding supplier', err);
          this.error = 'Error al registrar el proveedor. Por favor intente nuevamente.';
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(result => {
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
    }
  }

  removeEditSpecialty(index: number): void {
    this.editingSpecialties.splice(index, 1);
  }


  removeSpecialty(index: number): void {
    this.newSupplier.specialties.splice(index, 1);
  }



  resetForm(): void {
    this.newSupplier = {
      name: '',
      email: '',
      phone: 0,
      location: '',
      specialties: [],
      user_id: ''
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
