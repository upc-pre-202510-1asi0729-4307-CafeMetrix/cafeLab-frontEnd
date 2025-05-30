import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatToolbar } from '@angular/material/toolbar';
import { ToolbarComponent } from './public/components/toolbar/toolbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbar, TranslateModule, ToolbarComponent, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'cafeLab-frontEnd';

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.translateService.setDefaultLang('es');
    this.translateService.use('es');
  }
}
