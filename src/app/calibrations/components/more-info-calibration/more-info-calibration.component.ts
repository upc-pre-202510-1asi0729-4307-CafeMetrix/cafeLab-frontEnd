import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalibrationService } from '../../services/calibration.service';
import { Calibration } from '../../model/calibration.entity';
import {TranslatePipe} from '@ngx-translate/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-more-info-calibration',
  templateUrl: './more-info-calibration.component.html',
  imports: [
    TranslatePipe,
    NgIf
  ],
  styleUrls: ['./more-info-calibration.component.css']
})
export class MoreInfoCalibrationComponent implements OnInit {
  calibration: Calibration | null = null;

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
        },
        error: () => {
          alert('Error al cargar la calibración');
          this.router.navigate(['/grind-calibration']);
        }
      });
    }
  }
}
