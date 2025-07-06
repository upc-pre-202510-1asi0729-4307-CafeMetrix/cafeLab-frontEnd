import { Component } from '@angular/core';
import { Calibration } from '../../model/calibration.entity';
import { CalibrationService } from '../../services/calibration.service';
import { AuthService } from '../../../auth/services/AuthService';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-add-new-calibration',
  templateUrl: './add-new-calibration.component.html',
  styleUrls: ['./add-new-calibration.component.css'],
  standalone: true,
  imports: [
    TranslatePipe,
    FormsModule,
    NgIf
  ]
})
export class AddNewCalibrationComponent {
  calibration: Calibration = new Calibration({});
  sampleImageName: string | null = null;
  sampleImageFile: File | null = null;

  constructor(
    private calibrationService: CalibrationService,
    private authService: AuthService,
    private router: Router
  ) {}

  triggerFileInput() {
    const fileInput = document.getElementById('sampleImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // Limita a 100KB (102400 bytes)
      if (file.size > 102400) {
        alert('La imagen es demasiado grande. Selecciona una imagen menor a 100KB.');
        return;
      }
      this.sampleImageFile = file;
      this.sampleImageName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.calibration.sampleImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.calibration.userId = this.authService.getCurrentUserId();
    // Si tu backend espera la imagen como base64, ya está en calibration.sampleImage
    // Si espera un archivo, deberías usar FormData (no mostrado aquí)
    this.calibrationService.saveCalibration(this.calibration).subscribe({
      next: () => {
        this.router.navigate(['/grind-calibration']);
      },
      error: (err) => {
        alert('Error al registrar calibración');
        console.error(err);
      }
    });
  }
}
