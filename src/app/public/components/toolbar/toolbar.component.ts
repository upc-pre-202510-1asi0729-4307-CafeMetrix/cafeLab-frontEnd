import { Component } from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageSwitcherComponent} from '../language-switcher/language-switcher.component';
import {MatAnchor} from '@angular/material/button';
import {RouterLink, RouterLinkActive} from '@angular/router';


@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatToolbar,
    TranslatePipe,
    LanguageSwitcherComponent,
    MatAnchor,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {

}
