import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

interface EvaluacionSensorial {
  aroma: number;
  cuerpo: number;
  acidez: number;
  dulzor: number;
  amargor: number;
  aftertaste: number;
}

@Component({
  selector: 'app-detalles-cata',
  standalone: true,
  imports: [
    CommonModule,
    MatSliderModule,
    MatButtonModule,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './detalles-cata.component.html',
  styleUrls: ['./detalles-cata.component.css']
})
export class DetallesCataComponent {
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
