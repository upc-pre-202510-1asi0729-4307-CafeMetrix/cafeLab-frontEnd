import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  constructor(private translate: TranslateService) {
    translate.setDefaultLang('es');
    translate.use('es');
  }

  ngOnInit() {
    // Obtener el idioma del navegador
    const browserLang = this.translate.getBrowserLang();
    // Usar el idioma del navegador si está disponible, sino usar español
    this.translate.use(browserLang?.match(/es|en/) ? browserLang : 'es');
  }
}
