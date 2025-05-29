import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { ToolbarComponent } from './public/components/toolbar/toolbar.component';
import { ToolbarinitComponent } from './public/components/toolbarinit/toolbarinit.component';
import { User } from './auth/model/user.entity';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbar,
    ToolbarComponent,
    ToolbarinitComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'libraryDefects';
  currentUser: User | null = null;

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  ngOnInit() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  get showToolbar(): boolean {
    return !!this.currentUser?.hasPlan;
  }
}
