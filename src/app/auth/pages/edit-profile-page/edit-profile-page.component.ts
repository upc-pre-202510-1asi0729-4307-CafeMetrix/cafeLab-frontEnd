import { Component } from '@angular/core';
import { EditProfileFormComponent } from '../../components/edit-profile-form/edit-profile-form.component';
import { ToolbarinitComponent } from '../../../public/components/toolbarinit/toolbarinit.component';

@Component({
  selector: 'app-edit-profile-page',
  templateUrl: './edit-profile-page.component.html',
  styleUrls: ['./edit-profile-page.component.css'],
  standalone: true,
  imports: [EditProfileFormComponent, ToolbarinitComponent]
})
export class EditProfilePageComponent {}
