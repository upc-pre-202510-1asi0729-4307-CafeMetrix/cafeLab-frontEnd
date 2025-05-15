import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../auth/model/user.entity';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-complete-placeholder',
  templateUrl: './complete-placeholder.component.html',
  styleUrls: ['./complete-placeholder.component.css']
})
export class CompletePlaceholder implements OnInit {
  user: User = {} as User;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.user = user;
      console.log('Usuario cargado en dashboard completo:', this.user);
    } else {
      // Si no hay datos de usuario, redirigir al login
      this.router.navigate(['/login']);
    }
  }

  // Método para cerrar sesión
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getPlanName(planCode: string | undefined): string {
    const plans: {[key: string]: string} = {
      'barista': 'Plan Barista',
      'admin': 'Plan Dueño/Administrador',
      'complete': 'Plan Completo'
    };
    return planCode ? (plans[planCode] || 'Plan Desconocido') : 'Plan Desconocido';
  }

  getPaymentMethodName(method: string | undefined): string {
    const methods: {[key: string]: string} = {
      'visa': 'Tarjeta Visa',
      'mastercard': 'Tarjeta Mastercard'
    };
    return method ? (methods[method] || 'No especificado') : 'No especificado';
  }
}
