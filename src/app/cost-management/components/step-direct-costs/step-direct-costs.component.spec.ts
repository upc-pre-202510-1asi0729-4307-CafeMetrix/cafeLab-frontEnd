import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepDirectCostsComponent } from './step-direct-costs.component';

describe('StepDirectCostsComponent', () => {
  let component: StepDirectCostsComponent;
  let fixture: ComponentFixture<StepDirectCostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepDirectCostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepDirectCostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
