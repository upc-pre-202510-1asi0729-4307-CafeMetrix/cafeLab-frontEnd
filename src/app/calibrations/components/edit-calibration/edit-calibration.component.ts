import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalibrationService } from '../../services/calibration.service';
import { Calibration } from '../../model/calibration.entity';
import {TranslatePipe} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-edit-calibration',
  templateUrl: './edit-calibration.component.html',
  imports: [
    TranslatePipe,
    FormsModule,
    NgIf
  ],
  styleUrls: ['./edit-calibration.component.css']
})
export class EditCalibrationComponent implements OnInit {
  calibration: Calibration = new Calibration({});
  sampleImageName: string | null = null;
  sampleImageFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private calibrationService: CalibrationService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.calibrationService.getCalibrationById(id).subscribe({
        next: (data: Calibration) => {
          this.calibration = data;
          if (this.calibration.sampleImage) {
            this.sampleImageName = 'Imagen cargada';
          }
        },
        error: (err) => {
          alert('Error al cargar calibración');
          this.router.navigate(['/grind-calibration']);
        }
      });
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('sampleImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.sampleImageFile = input.files[0];
      this.sampleImageName = this.sampleImageFile.name;
      const reader = new FileReader();
      reader.onload = () => {
        this.calibration.sampleImage = reader.result as string;
      };
      reader.readAsDataURL(this.sampleImageFile);
    }
  }

  onUpdate() {
    this.calibrationService.updateCalibration(this.calibration.id, this.calibration).subscribe({
      next: () => {
        this.router.navigate(['/grind-calibration']);
      },
      error: (err) => {
        alert('Error al actualizar calibración');
        console.error(err);
      }
    });
  }
}
