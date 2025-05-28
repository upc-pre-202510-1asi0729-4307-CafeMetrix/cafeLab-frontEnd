import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogupBaristaFormComponent } from './logup-barista-form.component';

describe('LogupBaristaFormComponent', () => {
  let component: LogupBaristaFormComponent;
  let fixture: ComponentFixture<LogupBaristaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogupBaristaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogupBaristaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
