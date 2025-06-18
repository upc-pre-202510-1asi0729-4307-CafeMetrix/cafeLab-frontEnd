import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepLotSelectionComponent } from './step-lot-selection.component';

describe('StepLotSelectionComponent', () => {
  let component: StepLotSelectionComponent;
  let fixture: ComponentFixture<StepLotSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepLotSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepLotSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
