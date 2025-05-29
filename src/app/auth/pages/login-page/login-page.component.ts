import { Component } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { ToolbarComponent } from '../../../public/components/toolbar/toolbar.component';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  standalone: true,
  imports: [LoginFormComponent, ToolbarComponent]
})
export class LoginPageComponent {}
