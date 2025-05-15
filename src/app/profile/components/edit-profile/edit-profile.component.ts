import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {NgClass} from '@angular/common';

// Definimos la interfaz para el perfil
interface Profile {
  id: string;
  name: string;
  lastname: string;
  email: string;
  cafeteriaName: string;
  role: string;
  paymentMethod: string;
  profilePicture: string | null;
  experience?: string;
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  imports: [
    TranslatePipe,
    NgClass
  ],
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  profile: Profile = {
    id: '',
    name: '',
    lastname: '',
    email: '',
    cafeteriaName: '',
    role: '',
    paymentMethod: '',
    profilePicture: null,
  };

  editingName = false;
  editingLastname = false;
  editingEmail = false;
  editingCafeteria = false;
  previewImage: string | null = null;
  selectedFile: File | null = null;
  message = '';
  messageType = 'success';
  showPlanButton = false;
  defaultProfilePic = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48IS0tIEZvbnQgQXdlc29tZSBGcmVlIDUuMTUuNCBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbSBMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZS9mcmVlIENvcHlyaWdodCAyMDIzIEZvbnRpY29ucywgSW5jLiAtLT48cGF0aCBkPSJNMjI0IDI1NkE3MiA3MiAwIDEgMCAyMjQgMTEyYTcyIDcyIDAgMSAwIDAgMTQ0em0wLTE3NmE0MCA0MCAwIDEgMSAwIDgwIDQwIDQwIDAgMSAxIDAtODBaTTEuNCAxMTIuNUMyNS45IDI2IDExMS43LTI2LjkgOTkuMiA3LjhDMTYwIDY5LjIgNzUgOTYgOTkuMiAxMjEuMmMxMi41IDEyLjUgMTIuNSAzMi44IDAgNDUuM0w2My44IDIwMi44YzMuMyAyNC42IDE0LjcgNDAgMjYuOSA0OXMyOC4xIDExLjYgNDYuOSAxNi43Yy0yNC45IDgtNDUuMiAxOS43LTU4IDMxLjVDNjQgMzE0IDU0LjQgMzMwLjggNTAuOCAzNDUuQzQ1LjkgMzY0LjQgNDggMzgyLjYgNTMuMiAzOTcuNWMxMS41IDMyLjcgMzYuMSA2Mi4yIDczLjIgNjEuNUM4My4zIDQ1OC4zIDg2LjggNDU5IDkwLjMgNDU5LjhsMzAuMiA2LjNjOS40IDIgMTkuMSA0LjEgMjguOCA0LjFzMTkuNS0yLjEgMjguOS00LjFsMzAuMi02LjNjMTguNy0zLjkgMjMuNS00LjYgMjYuMyA0LjNjMzcuMSAuNyA2MS44LTI4LjkgNzMuMy02MS41YzUuMi0xNC45IDcuMy0zMy4xIDIuNS01Mi40Yy0zLjYtMTQuMy0xMy4yLTMxLjItMjkuOC00NS4yYy0xMi44LTEwLjctMzAuNS0yMS42LTUyLjctMjkuNWMxNy44LTUuMiAzNC4zLTkuNCA0Ni40LTE2LjdjMTEuNi03IDIzLjgtMjMuMiAyNy04OC4ybC0zOS41LTM4LjljLTEyLjYtMTIuNi0xMi42LTMyLjkgMC00NS40YzI0LjItMjUuMi0xMC43LTUyLjEgNjEuNS0xMjIuOGMtMTIuNS0zNC43IDczLjMgMTggOTcuOCAxMDQuN2wzLjMgMTEuNmMzLjUgMTIuNS0zLjQgMjYtMTUuNSAyOS43bC05LjggMi45YzExLjEgMzIuNCAyNS44IDg5LjEgMjUuMiAxMzkuMmMtLjQgMzQuNS0xNS45IDYyLjUtMzkuNyA4NS40CmMtMTUuMyAxNC44LTM1LjMgMjQuNy01Ny44IDI5LjhjLTUuOSAxLjMtMTIgMi03LjUgOS4yYzUgOCA1LjUgOC44IDMuOCAxMi41Yy0yLjUgNS4zLTE0LjUgOS44LTE4LjIgNC40Yy0zLjctNS40LTgtMTMuMi00LjMtMjEuNmMyLjMtNS4yLTE0LjItMTcuMy0xOS4yLTIzLjFjLTQuNy01LjQtMzIuMi00Mi42LTMyLjItOTguOS0zLjYuMi03LjguMi0xMS42LjItMy44IDAtOC4xIDAtMTEuNi0uMmMwIDU2LjMtMjcuNSA5My41LTMyLjIgOTguOWMtNSA1LjgtMjEuNSAxNy45LTE5LjEgMjMuMWMzLjcgOC40LS42IDE2LjItNC40IDIxLjZjLTMuNyA1LjQtMTUuNy45LTE4LjItNC40Yy0xLjctMy43LTEuMi00LjUgMy44LTEyLjVjNC41LTcuMi0xLjYtNy45LTcuNS05LjJjLTIyLjQtNS4xLTQyLjQtMTUtNTcuOC0yOS44Yy0yMy44LTIzLTM5LjMtNTEtMzkuNy04NS40Yy0uNi01MC4yIDE0LjEtMTA2LjkgMjUuMi0xMzkuMmwtOS44LTIuOWMtMTIuMS0zLjctMTktMTcuMS0xNS41LTI5LjdsMy4zLTExLjZjMy41LTEyLjIuNC0yNS42LTguMy0zNS41Yy0xMS4yLTEyLjcgMi4xLTIxLjEgMjQtNjlsOS4xLTE5LjdjMy44LTcuOCAxNC05LjIgMTkuNi00LjNsOS43IDguNWM3LjUtNi4yIDIxLjItMTkuNCAzMi40LTQxQzE1My40IDczLjUgMTU0IDUxLjIgMTYuMSAwIDEwLjggMjAuNiA3LjcgMzMuNiA0LjMgNTAuOEwwIDY1LjNjLTIuNyA5LjYtLjIgMjAuMyA2LjQgMTN6bTc0IDk3LjFjLS4xLTEuOCAyLjUgMTYuOSA0MC44IDE2czQwLjgtMTguNiA0MC45LTE2LjdsLTIuMy0yLjJjLTMuMi0zLjEgMy41IDcgMS45LTQuNGMtMS45LTE0LjYtMTkuOC0uMi00MC41LS4ycy0zOC42LTE0LTQwLjUuMmMtMS42IDExLjcgNS40IDEuNiAxLjkgNS44bC0yLjIgMS42eiIvPjwvc3ZnPg==';

  // Validación de formulario
  validationErrors: {
    paymentMethod: string
  } = {
    paymentMethod: ''
  };

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  get isOwner(): boolean {
    return this.profile.role === 'dueno_cafeteria';
  }

  loadUserProfile(): void {
    // Resetear completamente los datos del perfil para evitar datos residuales
    this.profile = {
      id: '',
      name: '',
      lastname: '',
      email: '',
      cafeteriaName: '',
      role: '',
      paymentMethod: '',
      profilePicture: null
    };

    // Resetear también la vista previa de la imagen y el botón de plan
    this.previewImage = null;
    this.selectedFile = null;
    this.showPlanButton = false;

    // Resetear validaciones
    this.validationErrors = {
      paymentMethod: ''
    };

    // Obtener información del usuario desde localStorage
    console.log('====== CARGANDO PERFIL DE USUARIO ======');

    // Obtener información del usuario desde localStorage
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log("Cargando perfil del usuario:", user);

        // Asignar cada propiedad al objeto limpio
        this.profile.id = user.id || '';
        this.profile.name = user.name ? user.name.split(' ')[0] : '';
        this.profile.lastname = user.name && user.name.split(' ').length > 1 ? user.name.split(' ').slice(1).join(' ') : '';
        this.profile.email = user.email || '';
        this.profile.cafeteriaName = user.cafeteriaName || '';
        this.profile.role = user.role || '';
        this.profile.paymentMethod = user.paymentMethod || '';
        this.profile.profilePicture = user.profilePicture || null;

        // Actualizar la vista previa de la imagen si existe
        if (user.profilePicture) {
          this.previewImage = user.profilePicture;
        }

        // Comprobar si debe mostrar el botón de plan
        this.showPlanButton = user && !user.hasPlan;

        // Resetear estados de edición
        this.editingName = false;
        this.editingLastname = false;
        this.editingEmail = false;
        this.editingCafeteria = false;

        console.log("Perfil cargado:", this.profile);
      } catch (e) {
        console.error('Error al parsear el usuario del localStorage:', e);
      }
    }
  }

  toggleEdit(field: string): void {
    switch(field) {
      case 'name':
        this.editingName = !this.editingName;
        break;
      case 'lastname':
        this.editingLastname = !this.editingLastname;
        break;
      case 'email':
        this.editingEmail = !this.editingEmail;
        break;
      case 'cafeteria':
        this.editingCafeteria = !this.editingCafeteria;
        break;
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  handleFileUpload(event: Event): void {
    const element = event.target as HTMLInputElement;
    const file = element.files ? element.files[0] : null;

    if (!file) return;

    // Validación de tipo de archivo
    if (!file.type.match('image.*')) {
      this.message = 'Por favor selecciona una imagen válida';
      this.messageType = 'error';
      return;
    }

    // Verificar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.message = 'La imagen no debe superar los 5MB';
      this.messageType = 'error';
      return;
    }

    this.selectedFile = file;

    // Crear una vista previa de la imagen
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  validateForm(): boolean {
    let isValid = true;

    // Resetear errores de validación
    this.validationErrors = {
      paymentMethod: ''
    };

    // Validar método de pago
    if (!this.profile.paymentMethod) {
      this.validationErrors.paymentMethod = 'Por favor selecciona un método de pago';
      isValid = false;
    }

    return isValid;
  }

  async saveProfile(): Promise<void> {
    // Validar el formulario antes de proceder
    if (!this.validateForm()) {
      this.message = 'Por favor completa todos los campos requeridos';
      this.messageType = 'error';
      return;
    }

    try {
      // Combinar nombre y apellido
      const fullName = `${this.profile.name} ${this.profile.lastname}`.trim();

      // Verificar si existe un usuario actual en localStorage para obtener hasPlan y plan
      let currentUser: any = {};
      const currentUserStr = localStorage.getItem('currentUser');
      if (currentUserStr) {
        try {
          currentUser = JSON.parse(currentUserStr);
        } catch (e) {
          console.error('Error al parsear usuario actual:', e);
        }
      }

      // Crear el objeto de usuario actualizado
      const updatedUser: any = {
        id: this.profile.id,
        name: fullName,
        email: this.profile.email,
        role: this.profile.role,
        cafeteriaName: this.isOwner ? this.profile.cafeteriaName : '',
        experience: this.profile.experience || '',  // Asegurarse de incluir este campo
        paymentMethod: this.profile.paymentMethod, // Este campo ahora es obligatorio
        profilePicture: this.previewImage || '',
        hasPlan: currentUser.hasPlan || false,     // Preservar hasPlan
        plan: currentUser.plan || ''                // Preservar plan
      };

      // Si hay una imagen seleccionada, convertirla a base64
      if (this.selectedFile) {
        updatedUser.profilePicture = await this.convertFileToBase64(this.selectedFile);
      }

      // Actualizar perfil usando el servicio
      try {
        const result = await this.profileService.updateProfile(updatedUser);

        this.message = 'Perfil actualizado correctamente';
        this.messageType = 'success';

        // Actualizar datos en localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        // Mostrar botón para continuar a selección de plan solo después de guardar correctamente
        this.showPlanButton = !updatedUser.hasPlan;

      } catch (error) {
        console.error('Error al actualizar perfil con API:', error);
        this.message = 'Error al actualizar el perfil. Inténtalo de nuevo.';
        this.messageType = 'error';
        throw error;
      }
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      this.message = 'Error al actualizar el perfil. Inténtalo de nuevo.';
      this.messageType = 'error';
    }
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToSelectPlan(): void {
    this.router.navigate(['/select-plan']);
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }
}
