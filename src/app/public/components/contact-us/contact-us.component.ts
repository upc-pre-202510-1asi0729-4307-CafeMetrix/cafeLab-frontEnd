
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {ToolbarComponent} from '../toolbar/toolbar.component';
import * as L from 'leaflet';
import {MatToolbar} from '@angular/material/toolbar';


@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ToolbarComponent, FormsModule, MatToolbar],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent implements OnInit {
  contactForm = {
    nombre: '',
    correo: '',
    asunto: '',
    mensaje: '',
    archivos: null as FileList | null
  };

  showMap = false;
  map: any;

  // Información de contacto
  contactInfo = {
    email: 'contacto@cafelab.com',
    phone: '+51 912 345 678',
    linkedin: 'linkedin.com/in/cafe-metrix-cafelab-04862a368'
  };

  faqs = [
    {
      pregunta: 'CONTACT.FAQ.QUESTION_1',
      respuesta: 'CONTACT.FAQ.ANSWER_1',
      expanded: false
    },
    {
      pregunta: 'CONTACT.FAQ.QUESTION_2',
      respuesta: 'CONTACT.FAQ.ANSWER_2',
      expanded: false
    },
    {
      pregunta: 'CONTACT.FAQ.QUESTION_3',
      respuesta: 'CONTACT.FAQ.ANSWER_3',
      expanded: false
    },
    {
      pregunta: 'CONTACT.FAQ.QUESTION_4',
      respuesta: 'CONTACT.FAQ.ANSWER_4',
      expanded: false
    },
    {
      pregunta: 'CONTACT.FAQ.QUESTION_5',
      respuesta: 'CONTACT.FAQ.ANSWER_5',
      expanded: false
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onFileSelected(event: any): void {
    this.contactForm.archivos = event.target.files;
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      console.log('Formulario enviado:', this.contactForm);
      // Aquí implementarías la lógica para enviar el formulario
      alert('Mensaje enviado correctamente');
      this.resetForm();
    } else {
      alert('Por favor completa todos los campos requeridos');
    }
  }

  isFormValid(): boolean {
    return !!(this.contactForm.nombre &&
      this.contactForm.correo &&
      this.contactForm.asunto &&
      this.contactForm.mensaje);
  }

  resetForm(): void {
    this.contactForm = {
      nombre: '',
      correo: '',
      asunto: '',
      mensaje: '',
      archivos: null
    };
  }

  openEmail(): void {
    window.open('mailto:contacto@cafelab.com', '_blank');
  }

  openWhatsApp(): void {
    window.open('https://wa.me/51912345678', '_blank');
  }

  openLinkedIn(): void {
    window.open('https://linkedin.com/in/cafe-metrix-cafelab-04862a368', '_blank');
  }

  openMap(): void {
    this.showMap = true;
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  closeMap(): void {
    this.showMap = false;
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  initMap(): void {
    // Inicializar el mapa
    this.map = L.map('map').setView([-12.120556, -76.992222], 15);

    // Añadir capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Añadir un marcador
    L.marker([-12.120556, -76.992222]).addTo(this.map)
      .bindPopup('<b>Av. Encalada 365</b><br>Santiago de Surco, Lima, Perú')
      .openPopup();
  }

  toggleFaq(index: number): void {
    this.faqs[index].expanded = !this.faqs[index].expanded;
  }
}
