import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RoastProfileService } from '../../services/roast-profile.service';
import { RoastProfile } from '../../models/roast-profile.model';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../../../public/components/toolbar/toolbar.component';
import { MatToolbar } from '@angular/material/toolbar';
import { AuthService } from '../../../auth/services/AuthService';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-roast-profile-comparison',
  standalone: true,
  imports: [FormsModule, RouterLink, TranslateModule, CommonModule, ToolbarComponent, MatToolbar],
  templateUrl: './roast-profile-comparison.component.html',
  styleUrl: './roast-profile-comparison.component.css'
})
export class RoastProfileComparisonComponent implements OnInit {
  @ViewChild('comparisonCanvas', { static: true }) comparisonCanvas!: ElementRef<HTMLCanvasElement>;

  profiles: RoastProfile[] = [];
  roastSelectors: string[] = ['', '']; // Empieza con dos campos

  constructor(private roastProfileService: RoastProfileService,
              private authService: AuthService,
              private translate: TranslateService) {}

  ngOnInit(): void {
    this.roastProfileService.getAll()
      .subscribe(profiles => {
        this.profiles = profiles;
      });
  }

  addSelector(): void {
    if (this.roastSelectors.length < 4) {
      this.roastSelectors.push('');
    }
  }

  ngAfterViewChecked(): void {
    this.drawComparisonGraph();
  }

  drawComparisonGraph(): void {
    if (!this.comparisonCanvas) return;

    const canvas = this.comparisonCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 70;
    const graphWidth = canvas.width - padding * 2;
    const graphHeight = canvas.height - padding * 2;

    const selectedProfiles = this.roastSelectors
      .map(id => this.profiles.find(p => p.id === Number(id)))
      .filter(p => !!p) as RoastProfile[];

    if (selectedProfiles.length === 0) return;

    // Calcular ejes comunes
    const durationMax = Math.max(...selectedProfiles.map(p => p.duration));
    const tempStartMin = Math.min(...selectedProfiles.map(p => p.tempStart));
    const tempEndMax = Math.max(...selectedProfiles.map(p => p.tempEnd));

    const timeToX = (t: number) => padding + (t / durationMax) * graphWidth;
    const tempToY = (temp: number) =>
      canvas.height - padding - ((temp - tempStartMin) / (tempEndMax - tempStartMin)) * graphHeight;

    // --- Grilla ---
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;

    const xSteps = 10;
    const ySteps = 10;

    for (let i = 0; i <= xSteps; i++) {
      const t = (i / xSteps) * durationMax;
      const x = timeToX(t);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvas.height - padding);
      ctx.stroke();
    }

    for (let i = 0; i <= ySteps; i++) {
      const temp = tempStartMin + (i / ySteps) * (tempEndMax - tempStartMin);
      const y = tempToY(temp);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    // --- Ejes ---
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(padding, padding);
    ctx.stroke();

    // --- Etiquetas eje X ---
    ctx.font = '14px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    for (let i = 0; i <= xSteps; i++) {
      const t = (i / xSteps) * durationMax;
      const x = timeToX(t);
      ctx.fillText(
        `${t.toFixed(1)} ${this.translate.instant('comparison.minutos')}`,
        x,
        canvas.height - padding + 20
      );
    }

    // --- Etiquetas eje Y ---
    ctx.textAlign = 'right';
    for (let i = 0; i <= ySteps; i++) {
      const temp = tempStartMin + (i / ySteps) * (tempEndMax - tempStartMin);
      const y = tempToY(temp);
      ctx.fillText(
        `${temp.toFixed(0)} ${this.translate.instant('comparison.gradosCelsius')}`,
        padding - 10,
        y + 5
      );
    }

    // --- Título ---
    ctx.textAlign = 'center';
    ctx.font = '18px Arial';
    ctx.fillText(
      this.translate.instant('comparison.graficoTitulo'), // Usas la clave de tu i18n
      canvas.width / 2,
      padding / 2
    );

    // --- Dibujar cada curva ---
    const colors = ['#8e44ad', '#c0392b', '#2980b9', '#27ae60'];

    selectedProfiles.forEach((profile, index) => {
      ctx.strokeStyle = colors[index % colors.length];
      ctx.lineWidth = 3;
      ctx.beginPath();

      const steps = 100;
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * profile.duration;
        const temp = profile.tempStart + (profile.tempEnd - profile.tempStart) * Math.log1p(t) / Math.log1p(profile.duration);
        const x = timeToX(t);
        const y = tempToY(temp);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    // --- Leyenda ---
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    const legendX = canvas.width - padding - 200;
    const legendY = padding + 20;
    const lineHeight = 20;

    selectedProfiles.forEach((profile, index) => {
      ctx.strokeStyle = colors[index % colors.length];
      ctx.beginPath();
      ctx.moveTo(legendX, legendY + index * lineHeight);
      ctx.lineTo(legendX + 30, legendY + index * lineHeight);
      ctx.stroke();

      ctx.fillStyle = '#000';
      ctx.fillText(profile.name, legendX + 40, legendY + index * lineHeight + 5);
    });
  }
}
