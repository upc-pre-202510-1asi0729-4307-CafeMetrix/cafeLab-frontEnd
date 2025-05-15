import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="welcome-container">
      <h1>Bienvenido a Café Lab</h1>
      <p>Sistema de gestión para laboratorios de café</p>
      <div class="buttons-container">
        <a routerLink="/proveedores" class="welcome-button">
          <i class="material-icons">inventory</i>
          <span>Gestión de Proveedores</span>
        </a>
        <a routerLink="/lotes-cafe" class="welcome-button">
          <i class="material-icons">coffee</i>
          <span>Gestión de Lotes</span>
        </a>
        <a routerLink="/perfiles-tueste" class="welcome-button">
          <i class="material-icons">whatshot</i>
          <span>Perfiles de Tueste</span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .welcome-container {
      padding: 40px;
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 {
      color: #4A5A54;
      font-size: 32px;
      margin-bottom: 20px;
    }
    p {
      color: #666;
      font-size: 18px;
      margin-bottom: 40px;
    }
    .buttons-container {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
    }
    .welcome-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      background-color: #4A5A54;
      color: white;
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.3s ease;
      min-width: 200px;
    }
    .welcome-button:hover {
      background-color: #5B6B65;
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    .welcome-button i {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .welcome-button span {
      font-size: 16px;
      font-weight: 500;
    }
  `]
})
export class WelcomeComponent {} 