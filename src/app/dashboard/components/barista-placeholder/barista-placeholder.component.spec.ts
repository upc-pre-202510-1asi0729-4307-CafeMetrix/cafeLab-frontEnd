import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaristaPlaceholderComponent } from './barista-placeholder.component';

describe('BaristaPlaceholderComponent', () => {
  let component: BaristaPlaceholderComponent;
  let fixture: ComponentFixture<BaristaPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaristaPlaceholderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaristaPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
