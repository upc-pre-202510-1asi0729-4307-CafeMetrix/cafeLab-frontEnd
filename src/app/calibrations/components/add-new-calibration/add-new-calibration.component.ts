import { Component } from '@angular/core';
import { Calibration } from '../../model/calibration.entity';
import { CalibrationService } from '../../services/calibration.service';
import { AuthService } from '../../../auth/services/AuthService';
import { Router } from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-add-new-calibration',
  templateUrl: './add-new-calibration.component.html',
  styleUrls: ['./add-new-calibration.component.css'],
  standalone: true,
  imports: [
    TranslatePipe,
    FormsModule
  ]
})
export class AddNewCalibrationComponent {
  calibration: Calibration = new Calibration({});

  constructor(
    private calibrationService: CalibrationService,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    // Asigna el userId actual antes de guardar
    this.calibration.userId = this.authService.getCurrentUserId();
    this.calibrationService.saveCalibration(this.calibration).subscribe({
      next: () => {
        // Redirige o muestra mensaje de éxito
        this.router.navigate(['/grind-calibration']);
      },
      error: (err) => {
        // Manejo de error
        alert('Error al registrar calibración');
        console.error(err);
      }
    });
  }
}
