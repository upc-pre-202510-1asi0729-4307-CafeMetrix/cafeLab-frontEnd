import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  currentLanguage: 'ES' | 'EN' = 'ES';

  constructor(private translateService: TranslateService) {
    // Inicializar el idioma desde el servicio
    this.currentLanguage = this.translateService.currentLang === 'en' ? 'EN' : 'ES';
  }

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'ES' ? 'EN' : 'ES';
    const langCode = this.currentLanguage === 'ES' ? 'es' : 'en';
    this.translateService.use(langCode);
  }
}
