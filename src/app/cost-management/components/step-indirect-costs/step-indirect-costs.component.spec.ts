import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepIndirectCostsComponent } from './step-indirect-costs.component';

describe('StepIndirectCostsComponent', () => {
  let component: StepIndirectCostsComponent;
  let fixture: ComponentFixture<StepIndirectCostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepIndirectCostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepIndirectCostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
