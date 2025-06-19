import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { MatAnchor } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

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

  constructor(
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    this.langSub = this.translate.onLangChange.subscribe(() => {
      console.log('🌐 Idioma cambiado a:', this.translate.currentLang);
      this.translationsReady = true;
      this.cdr.detectChanges();
    });

    const lang = this.translate.currentLang || 'en';
    this.translate.use(lang).subscribe({
      next: () => {
        console.log('✅ Traducciones cargadas para', lang);
        this.translationsReady = true;
        this.cdr.detectChanges(); // 🔧 Asegura que el *ngIf vea el cambio
      },
      error: (err) => {
        console.error('❌ Error cargando traducciones:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }
}
