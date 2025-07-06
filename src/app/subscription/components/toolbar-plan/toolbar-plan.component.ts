import { Component } from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {LanguageSwitcherComponent} from '../../../public/components/language-switcher/language-switcher.component';
import {MatAnchor} from '@angular/material/button';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';


@Component({
  selector: 'app-toolbar-component',
  standalone: true,
  imports: [
    MatToolbar,
    LanguageSwitcherComponent,
    MatAnchor,
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage
  ],
  templateUrl: './toolbar-plan.component.html',
  styleUrl: './toolbar-plan.component.css'
})
export class ToolbarPlanComponent {

}
