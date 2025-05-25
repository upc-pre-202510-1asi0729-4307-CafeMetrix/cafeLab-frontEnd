import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {ToolbarComponent} from './public/components/toolbar/toolbar.component';



/**
 * Root component of the Café Lab application
 * @class AppComponent
 * @description
 * This component serves as the main entry point for the application.
 * It initializes the translation service and sets up the basic layout structure.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbar,
    ToolbarComponent,

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  /** Application title */
  title = 'libraryDefects';

  /** Navigation menu items */
  options = [
    { path: '/libraryDefects', title: 'Library' }
  ];


  /**
   * Creates an instance of AppComponent.
   * Initializes the translation service with English and Spanish languages.
   *
   * @param translate - The translation service for handling internationalization
   */
  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

}
