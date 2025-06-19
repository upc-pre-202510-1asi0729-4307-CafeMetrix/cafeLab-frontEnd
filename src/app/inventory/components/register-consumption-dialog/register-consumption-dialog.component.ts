import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { InventoryService } from '../../services/inventory.service';
import { InventoryEntry } from '../../model/inventory-entry.entity';

@Component({
  selector: 'app-register-consumption-dialog',
  standalone: true,
  templateUrl: './register-consumption-dialog.component.html',
  styleUrls: ['./register-consumption-dialog.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatButtonModule
  ]
})
export class RegisterConsumptionDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegisterConsumptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { coffeeLotId: number },
    private inventoryService: InventoryService
  ) {
    this.form = this.fb.group({
      quantityUsed: [0, [Validators.required, Validators.min(1)]],
      dateUsed: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  submit(): void {
    if (this.form.valid) {
      const entry: InventoryEntry = {
        id: 0,
        coffeeLotId: this.data.coffeeLotId,
        quantityUsed: this.form.value.quantityUsed,
        dateUsed: this.form.value.dateUsed
      };

      this.inventoryService.createEntry(entry).subscribe(saved => {
        this.dialogRef.close(saved);
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
