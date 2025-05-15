import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeBaristaComponent } from './welcome-barista.component';

describe('WelcomeBaristaComponent', () => {
  let component: WelcomeBaristaComponent;
  let fixture: ComponentFixture<WelcomeBaristaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeBaristaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeBaristaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
