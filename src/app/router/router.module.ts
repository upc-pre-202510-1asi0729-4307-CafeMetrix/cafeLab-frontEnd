import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importamos los componentes de autenticación
// Importamos los componentes de autenticación
import { LoginLayoutComponent } from '../auth/components/login-layout/login-layout.component';
import { SignupBaristaComponent } from '../auth/components/signup-barista/signup-barista.component';
import { SignupOwnerComponent } from '../auth/components/signup-owner/signup-owner.component';

// Importamos los componentes de dashboard
import { BaristaHomeComponent } from '../dashboard/components/barista-placeholder/barista-placeholder.component';
import { CompletePlaceholder } from '../dashboard/components/complete-placeholder/complete-placeholder.component';
import { OwnerHomeComponent } from '../dashboard/components/owner-placeholder/owner-placeholder.component';

// Importamos el componente de edición de perfil
import { EditProfileComponent } from '../profile/components/edit-profile/edit-profile.component';

// Para selección de suscripción Reemplazar
import { SelectPlanComponent } from '../subscription/components/select-plan/select-plan.component';

// Componente para páginas no encontradas
import { PageNotFoundComponent } from '../public/pages/page-not-found/page-not-found.component';

// Servicio de autenticación
import { AuthService } from '../auth/services/auth.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Creamos un único guard que contendrá toda la lógica
@Injectable({ providedIn: 'root' })
export class RouterGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const publicPages = ['/login', '/signup-barista', '/signup-owner'];
    const dashboardPages = ['/barista-home', '/owner-home', '/complete-dashboard'];
    const ownerSpecificPages = ['/owner'];

    const authRequired = !publicPages.includes(state.url);
    const loggedIn = this.authService.isAuthenticated();

    // Verificar si la ruta requiere autenticación y no hay usuario logueado
    if (authRequired && !loggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    if (loggedIn) {
      const user = this.authService.getCurrentUser();

      if (!user) {
        this.router.navigate(['/login']);
        return false;
      }

      console.log('Usuario actual:', user);
      console.log('¿Tiene plan?:', user.hasPlan);
      console.log('Plan seleccionado:', user.plan);

      // Verificar si la ruta tiene requisitos de rol específicos
      if (route.data && route.data['role'] && route.data['role'] !== user.role) {
        console.log(`Usuario con rol ${user.role} intentando acceder a ruta para ${route.data['role']}`);
        // Redirigir según su rol
        if (user.role === 'barista') {
          this.router.navigate(['/barista-home']);
          return false;
        } else if (user.role === 'dueno_cafeteria') {
          this.router.navigate(['/owner-home']);
          return false;
        }
      }

      // Si el usuario tiene plan completo, redirigir al dashboard completo
      if (user.hasPlan === true && user.plan === 'complete') {
        // Si intenta acceder a dashboards que no le corresponden
        if (state.url === '/barista-home' || state.url === '/owner-home') {
          console.log('Usuario con plan completo intentando acceder a otro dashboard');
          this.router.navigate(['/complete-dashboard']);
          return false;
        }
      }
      // Si tiene otro plan pero intenta acceder al dashboard completo
      else if (user.hasPlan === true && user.plan !== 'complete' && state.url === '/complete-dashboard') {
        console.log('Usuario sin plan completo intentando acceder al dashboard completo');
        // Redirigir según su rol
        if (user.role === 'barista') {
          this.router.navigate(['/barista-home']);
          return false;
        } else if (user.role === 'dueno_cafeteria') {
          this.router.navigate(['/owner-home']);
          return false;
        }
      }

      // Si intenta acceder a editar perfil pero ya tiene un perfil completo
      if (state.url === '/edit-profile') {
        const prevUrl = this.router.getCurrentNavigation()?.previousNavigation?.finalUrl?.toString() || '';
        const hasCompletedProfile =
          user.hasPlan === true &&
          user.plan &&
          user.paymentMethod;

        if (hasCompletedProfile && !prevUrl.includes('/select-plan')) {
          console.log('Usuario con perfil completo intentando acceder a editar perfil');
          // Redirigir según el plan
          if (user.plan === 'complete') {
            this.router.navigate(['/complete-dashboard']);
            return false;
          } else if (user.role === 'barista') {
            this.router.navigate(['/barista-home']);
            return false;
          } else if (user.role === 'dueno_cafeteria') {
            this.router.navigate(['/owner-home']);
            return false;
          }
        }
      }

      // Si intenta acceder a dashboards pero no tiene plan seleccionado
      if ((dashboardPages.includes(state.url) || ownerSpecificPages.some(path => state.url.startsWith(path))) && user.hasPlan !== true) {
        console.log('Usuario sin plan intenta acceder al dashboard');
        this.router.navigate(['/select-plan']);
        return false;
      }

      // Si intenta acceder a páginas públicas estando autenticado
      if (publicPages.includes(state.url)) {
        // Si tiene plan, redirigir según su plan
        if (user.hasPlan === true) {
          if (user.plan === 'complete') {
            this.router.navigate(['/complete-dashboard']);
            return false;
          } else if (user.role === 'barista') {
            this.router.navigate(['/barista-home']);
            return false;
          } else if (user.role === 'dueno_cafeteria') {
            this.router.navigate(['/owner-home']);
            return false;
          }
        }
      }
    }

    // Si todo está bien, continuar
    return true;
  }
}

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginLayoutComponent
  },
  {
    path: 'signup-barista',
    component: SignupBaristaComponent
  },
  {
    path: 'signup-owner',
    component: SignupOwnerComponent
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent,
    canActivate: [RouterGuard]
  },
  {
    path: 'barista-home',
    component: BaristaHomeComponent,
    canActivate: [RouterGuard],
    data: { role: 'barista' }
  },
  {
    path: 'owner-home',
    component: OwnerHomeComponent,
    canActivate: [RouterGuard],
    data: { role: 'dueno_cafeteria' }
  },
  {
    path: 'complete-dashboard',
    component: CompletePlaceholder,
    canActivate: [RouterGuard],
    data: { plan: 'complete' }
  },
  {
    path: 'select-plan',
    component: SelectPlanComponent,
    canActivate: [RouterGuard]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [RouterGuard]
})
export class AppRoutingModule { }

// Añade esta línea al final del archivo
export { routes };
