import { Component, OnInit } from '@angular/core';
import { RoastProfileService} from '../../services/roast-profile.service';
import { RoastProfile} from '../../models/roast-profile.model';
import { RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import { FormsModule, NgForm } from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ToolbarComponent} from '../../../public/components/toolbar/toolbar.component';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
  selector: 'app-roast-profile-comparison',
  standalone: true,
  imports: [FormsModule, RouterLink, TranslateModule, CommonModule, ToolbarComponent, MatToolbar],
  templateUrl: './roast-profile-comparison.component.html',
  styleUrl: './roast-profile-comparison.component.css'
})
export class RoastProfileComparisonComponent implements OnInit {
  profiles: RoastProfile[] = [];
  roastSelectors: string[] = ['', '']; // Empieza con dos campos

  constructor(private roastProfileService: RoastProfileService) {}

  ngOnInit(): void {
    this.roastProfileService.getRoastProfiles().subscribe(profiles => {
      this.profiles = profiles;
    });
  }

  addSelector(): void {
    if (this.roastSelectors.length < 4) {
      this.roastSelectors.push('');
    }
  }
}
