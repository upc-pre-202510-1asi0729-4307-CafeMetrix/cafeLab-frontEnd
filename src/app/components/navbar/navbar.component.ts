import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  currentLanguage: 'ES' | 'EN' = 'ES';

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'ES' ? 'EN' : 'ES';
    // Aquí iría la lógica para cambiar el idioma usando i18n
  }
} 