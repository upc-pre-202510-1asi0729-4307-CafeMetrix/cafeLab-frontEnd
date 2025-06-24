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
import {TranslatePipe} from '@ngx-translate/core';

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
    MatButtonModule,
    TranslatePipe
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
      const payload = {
        ...this.form.value,
        coffeeLotId: this.data.coffeeLotId,
        dateUsed: new Date(this.form.value.dateUsed + 'T00:00:00').toISOString()
      };
      this.dialogRef.close(payload);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
