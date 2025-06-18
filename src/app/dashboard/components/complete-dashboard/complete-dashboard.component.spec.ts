import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteDashboardComponent } from './complete-dashboard.component';

describe('CompleteDashboardComponent', () => {
  let component: CompleteDashboardComponent;
  let fixture: ComponentFixture<CompleteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
