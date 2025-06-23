import { Component } from '@angular/core';
import { Calibration } from '../../model/calibration.entity';
import {TranslatePipe} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-add-new-calibration',
  templateUrl: './add-new-calibration.component.html',
  imports: [
    TranslatePipe,
    FormsModule,
    MatIcon,
    MatButton,
    NgIf
  ],
  styleUrls: ['./add-new-calibration.component.css']
})
export class AddNewCalibrationComponent {
  calibration: Calibration = new Calibration({});
  sampleFile: File | null = null;
  sampleFileName: string = '';
  sampleFileUrl: string | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.sampleFile = file;
      this.sampleFileName = file.name;
      this.sampleFileUrl = URL.createObjectURL(file);
    }
  }

  downloadSample() {
    if (this.sampleFileUrl && this.sampleFileName) {
      const a = document.createElement('a');
      a.href = this.sampleFileUrl;
      a.download = this.sampleFileName;
      a.click();
    }
  }

  viewSample() {
    if (this.sampleFileUrl) {
      window.open(this.sampleFileUrl, '_blank');
    }
  }

  onSubmit() {
    // Aquí va la lógica para guardar la calibración
    alert('Calibración registrada');
  }
}
