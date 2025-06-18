import { Component } from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {TranslateModule, TranslatePipe} from '@ngx-translate/core';
import {LanguageSwitcherComponent} from '../language-switcher/language-switcher.component';
import {MatAnchor} from '@angular/material/button';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import {CommonModule} from '@angular/common';


@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatToolbar,
    TranslatePipe,
    LanguageSwitcherComponent,
    MatAnchor,
    RouterLink,
    RouterLinkActive,
    TranslateModule,
    CommonModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent implements OnDestroy {
  translationsReady = false;
  private langSub?: Subscription;

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.translationsReady = true;
    });

    // En caso ya esté listo desde antes
    if (this.translate.currentLang) {
      this.translationsReady = true;
    } else {
      this.translate.use('en'); // activa si aún no está
    }
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }
}
