import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaristaDashboardComponent } from './barista-dashboard.component';

describe('BaristaDashboardComponent', () => {
  let component: BaristaDashboardComponent;
  let fixture: ComponentFixture<BaristaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaristaDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaristaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
