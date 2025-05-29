import { Component } from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageSwitcherComponent} from '../language-switcher/language-switcher.component';
import {MatAnchor} from '@angular/material/button';
import {RouterLink, RouterLinkActive} from '@angular/router';


@Component({
  selector: 'app-toolbarinit',
  imports: [
    MatToolbar,
    TranslatePipe,
    LanguageSwitcherComponent,
    MatAnchor,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './toolbarinit.component.html',
  styleUrl: './toolbarinit.component.css'
})
export class ToolbarinitComponent {

}
