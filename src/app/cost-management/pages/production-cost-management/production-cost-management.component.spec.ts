import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionCostPageComponent } from './production-cost-management.component';

describe('ProductionCostPageComponent', () => {
  let component: ProductionCostPageComponent;
  let fixture: ComponentFixture<ProductionCostPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionCostPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionCostPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
