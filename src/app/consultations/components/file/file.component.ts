import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DefectService } from '../../services/defect.service';
import { Defect } from '../../model/defect.entity';
import {TranslatePipe} from '@ngx-translate/core';
import {NgIf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  imports: [
    TranslatePipe,
    MatIconModule,
    NgIf,

  ],
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {
  defect: Defect | null = null;
  show: 'main' | 'causes' | 'solutions' = 'main';

  constructor(
    private route: ActivatedRoute,
    private defectService: DefectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.defectService.getById(id).subscribe(defect => {
      this.defect = defect;
    });
  }

  showCauses() {
    this.show = 'causes';
  }

  showSolutions() {
    this.show = 'solutions';
  }

  goBack() {
    this.router.navigate(['/libraryDefects']);
  }

  showMain() {
    this.show = 'main';
  }
}
