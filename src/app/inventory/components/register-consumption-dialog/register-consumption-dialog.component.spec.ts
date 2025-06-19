import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterConsumptionDialogComponent } from './register-consumption-dialog.component';

describe('RegisterConsumptionDialogComponent', () => {
  let component: RegisterConsumptionDialogComponent;
  let fixture: ComponentFixture<RegisterConsumptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterConsumptionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterConsumptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
