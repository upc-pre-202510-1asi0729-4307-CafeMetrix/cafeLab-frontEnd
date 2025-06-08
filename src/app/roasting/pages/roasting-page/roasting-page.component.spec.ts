import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoastingPageComponent } from './roasting-page.component';

describe('RoastingPageComponent', () => {
  let component: RoastingPageComponent;
  let fixture: ComponentFixture<RoastingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoastingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoastingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
