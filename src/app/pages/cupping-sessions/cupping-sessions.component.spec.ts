import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuppingSessionsComponent } from './cupping-sessions.component';

describe('CuppingSessionsComponent', () => {
  let component: CuppingSessionsComponent;
  let fixture: ComponentFixture<CuppingSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuppingSessionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuppingSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
