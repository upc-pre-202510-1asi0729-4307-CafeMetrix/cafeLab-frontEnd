import { Component, OnInit } from '@angular/core';
import { CoffeeService } from '../../../consultations/services/coffe.service';
import { DefectService } from '../../../consultations/services/defect.service';
import { Coffee } from '../../../consultations/model/coffe.entity';
import { Defect } from '../../../consultations/model/defect.entity';
import {ToolbarComponent} from '../../components/toolbar/toolbar.component';
import {
  ViewConsultationsComponent
} from '../../../consultations/components/view-consultations/view-consultations.component';

@Component({
  selector: 'app-library-defect',
  templateUrl: './library-defect.component.html',
  imports: [
    ToolbarComponent,
    ViewConsultationsComponent
  ],
  styleUrls: ['./library-defect.component.css']
})
export class LibraryDefectComponent implements OnInit {
  coffees: Coffee[] = [];
  defects: Defect[] = [];
  history: any[] = [];

  constructor(
    private coffeeService: CoffeeService,
    private defectService: DefectService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.coffeeService.getAll().subscribe(coffees => {
      this.coffees = coffees;
      this.defectService.getAll().subscribe(defects => {
        this.defects = defects;
        this.history = this.defects.map(defect => {
          const coffee = this.coffees.find(c => c.id === defect.coffeeId);
          return {
            ...defect,
            coffeeName: coffee ? coffee.name : ''
          };
        });
      });
    });
  }
}
