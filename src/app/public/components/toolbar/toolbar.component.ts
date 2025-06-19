import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { MatAnchor, MatButton } from '@angular/material/button';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/AuthService';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatToolbar,
    TranslatePipe,
    LanguageSwitcherComponent,
    MatAnchor,
    RouterLink,
    RouterLinkActive,
    MatButton
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {
  constructor(private authService: AuthService, private router: Router) {}

  redirectToFeatures() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      // Usuario no autenticado: opcionalmente redirigir a login
      this.router.navigate(['/login']);
      return;
    }

    // Rutas por plan
    switch (user.plan) {
      case 'barista':
        this.router.navigate(['/dashboard/barista']);
        break;
      case 'owner':
        this.router.navigate(['/dashboard/owner']);
        break;
      case 'full':
        this.router.navigate(['/dashboard/complete']);
        break;
      default:
        this.router.navigate(['/features']); // Ruta genérica
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
