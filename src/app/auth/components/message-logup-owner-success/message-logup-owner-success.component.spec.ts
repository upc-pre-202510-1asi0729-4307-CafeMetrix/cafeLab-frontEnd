import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageLogupOwnerSuccessComponent } from './message-logup-owner-success.component';

describe('MessageLogupOwnerSuccessComponent', () => {
  let component: MessageLogupOwnerSuccessComponent;
  let fixture: ComponentFixture<MessageLogupOwnerSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageLogupOwnerSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageLogupOwnerSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
