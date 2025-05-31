import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanCardComponentComponent } from './plan-card-component.component';

describe('PlanCardComponentComponent', () => {
  let component: PlanCardComponentComponent;
  let fixture: ComponentFixture<PlanCardComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanCardComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanCardComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
