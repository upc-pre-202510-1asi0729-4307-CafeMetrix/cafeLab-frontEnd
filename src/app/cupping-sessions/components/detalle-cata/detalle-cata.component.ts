import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

interface EvaluacionSensorial {
  aroma: number;
  cuerpo: number;
  acidez: number;
  dulzor: number;
  amargor: number;
  aftertaste: number;
}

@Component({
  selector: 'app-detalle-cata',
  standalone: true,
  imports: [
    CommonModule,
    MatSliderModule,
    MatButtonModule,
    FormsModule
  ],
  template: `
    <div class="detalle-container">
      <!-- Primera columna: Evaluación Sensorial -->
      <div class="columna evaluacion-sensorial">
        <h2 class="titulo-seccion">Evaluación Sensorial</h2>
        <div class="sliders-container">
          <div class="slider-group">
            <label>Aroma</label>
            <mat-slider min="1" max="10" step="1" discrete>
              <input matSliderThumb [(ngModel)]="evaluacion.aroma">
            </mat-slider>
            <span class="valor">{{evaluacion.aroma}}</span>
          </div>
          <div class="slider-group">
            <label>Cuerpo</label>
            <mat-slider min="1" max="10" step="1" discrete>
              <input matSliderThumb [(ngModel)]="evaluacion.cuerpo">
            </mat-slider>
            <span class="valor">{{evaluacion.cuerpo}}</span>
          </div>
          <div class="slider-group">
            <label>Acidez</label>
            <mat-slider min="1" max="10" step="1" discrete>
              <input matSliderThumb [(ngModel)]="evaluacion.acidez">
            </mat-slider>
            <span class="valor">{{evaluacion.acidez}}</span>
          </div>
          <div class="slider-group">
            <label>Dulzor</label>
            <mat-slider min="1" max="10" step="1" discrete>
              <input matSliderThumb [(ngModel)]="evaluacion.dulzor">
            </mat-slider>
            <span class="valor">{{evaluacion.dulzor}}</span>
          </div>
          <div class="slider-group">
            <label>Amargor</label>
            <mat-slider min="1" max="10" step="1" discrete>
              <input matSliderThumb [(ngModel)]="evaluacion.amargor">
            </mat-slider>
            <span class="valor">{{evaluacion.amargor}}</span>
          </div>
          <div class="slider-group">
            <label>Aftertaste</label>
            <mat-slider min="1" max="10" step="1" discrete>
              <input matSliderThumb [(ngModel)]="evaluacion.aftertaste">
            </mat-slider>
            <span class="valor">{{evaluacion.aftertaste}}</span>
          </div>
        </div>
        <button mat-raised-button class="action-button" (click)="generarHexagono()">
          Generar hexágono sensorial
        </button>
      </div>

      <!-- Segunda columna: Hexágono Sensorial -->
      <div class="columna hexagono-sensorial">
        <div class="hexagono-container">
          <!-- Aquí se generará el hexágono -->
        </div>
        <div class="defectos-section">
          <p>¿Detectó algún defecto en la degustación?</p>
          <button mat-raised-button class="action-button" (click)="abrirBibliotecaDefectos()">
            Biblioteca de Defectos
          </button>
        </div>
      </div>

      <!-- Tercera columna: Información -->
      <div class="columna informacion">
        <div class="info-section">
          <h3>Lote Vinculado:</h3>
          <p>{{sesion.loteNombre}}</p>
        </div>

        <div class="info-section">
          <h3>Perfil de tueste vinculado:</h3>
          <p>{{sesion.perfilNombre}}</p>
        </div>

        <button mat-raised-button class="action-button guardar-button" (click)="guardarSesion()">
          Guardar sesión de cata
        </button>
      </div>
    </div>
  `,
  styles: [`
    .detalle-container {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 2rem;
      padding: 2rem;
    }

    .columna {
      padding: 1rem;
    }

    .titulo-seccion {
      color: #414535;
      font-family: 'Montserrat', sans-serif;
      font-weight: bold;
      font-size: 24px;
      margin-bottom: 2rem;
    }

    .sliders-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .slider-group {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .slider-group label {
      min-width: 100px;
      font-family: 'Nunito', sans-serif;
    }

    .slider-group mat-slider {
      flex-grow: 1;
    }

    .valor {
      min-width: 30px;
      text-align: right;
    }

    .action-button {
      background-color: #414535 !important;
      color: white !important;
      padding: 0.5rem 2rem;
      width: fit-content;
    }

    .hexagono-container {
      height: 300px;
      border: 2px dashed #414535;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .defectos-section {
      text-align: center;
    }

    .defectos-section p {
      margin-bottom: 1rem;
      font-family: 'Nunito', sans-serif;
    }

    .info-section {
      margin-bottom: 2rem;
    }

    .info-section h3 {
      font-family: 'Nunito', sans-serif;
      color: #414535;
      margin-bottom: 0.5rem;
    }

    .info-section p {
      font-family: 'Nunito', sans-serif;
      font-size: 1.1rem;
    }

    .guardar-button {
      width: 100%;
    }
  `]
})
export class DetalleCataComponent {
  @Input() sesion: any;

  evaluacion: EvaluacionSensorial = {
    aroma: 5,
    cuerpo: 5,
    acidez: 5,
    dulzor: 5,
    amargor: 5,
    aftertaste: 5
  };

  generarHexagono() {
    // Implementar lógica para generar el hexágono
    console.log('Generando hexágono con valores:', this.evaluacion);
  }

  abrirBibliotecaDefectos() {
    // Implementar lógica para abrir la biblioteca de defectos
    console.log('Abriendo biblioteca de defectos');
  }

  guardarSesion() {
    // Implementar lógica para guardar la sesión
    console.log('Guardando sesión de cata');
  }
} 