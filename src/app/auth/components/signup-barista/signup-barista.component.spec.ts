import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupBaristaComponent } from './signup-barista.component';

describe('SignupBaristaComponent', () => {
  let component: SignupBaristaComponent;
  let fixture: ComponentFixture<SignupBaristaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupBaristaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupBaristaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
