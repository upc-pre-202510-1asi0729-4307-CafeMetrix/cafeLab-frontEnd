import { Component } from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {LanguageSwitcherComponent} from '../language-switcher/language-switcher.component';

@Component({
  selector: 'app-toolbarinit',
  imports: [
    MatToolbar,
    LanguageSwitcherComponent
  ],
  templateUrl: './toolbarinit.component.html',
  styleUrl: './toolbarinit.component.css'
})
export class ToolbarinitComponent {

}
