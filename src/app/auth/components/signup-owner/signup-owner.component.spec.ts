import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupOwnerComponent } from './signup-owner.component';

describe('SignupOwnerComponent', () => {
  let component: SignupOwnerComponent;
  let fixture: ComponentFixture<SignupOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupOwnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
