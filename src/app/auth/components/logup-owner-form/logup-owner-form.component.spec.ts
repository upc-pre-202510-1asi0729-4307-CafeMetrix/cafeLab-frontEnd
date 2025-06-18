import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogupOwnerFormComponent } from './logup-owner-form.component';

describe('LogupOwnerFormComponent', () => {
  let component: LogupOwnerFormComponent;
  let fixture: ComponentFixture<LogupOwnerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogupOwnerFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogupOwnerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
