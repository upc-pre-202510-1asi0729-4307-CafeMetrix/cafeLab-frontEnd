import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageLogupBaristaSuccessComponent } from './message-logup-barista-success.component';

describe('MessageLogupBaristaSuccessComponent', () => {
  let component: MessageLogupBaristaSuccessComponent;
  let fixture: ComponentFixture<MessageLogupBaristaSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageLogupBaristaSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageLogupBaristaSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
