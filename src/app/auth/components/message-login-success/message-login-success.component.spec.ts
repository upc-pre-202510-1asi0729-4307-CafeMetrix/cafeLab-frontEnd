import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageLoginSuccessComponent } from './message-login-success.component';

describe('MessageLoginSuccessComponent', () => {
  let component: MessageLoginSuccessComponent;
  let fixture: ComponentFixture<MessageLoginSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageLoginSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageLoginSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
