import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerPlaceholderComponent } from './owner-placeholder.component';

describe('OwnerPlaceholderComponent', () => {
  let component: OwnerPlaceholderComponent;
  let fixture: ComponentFixture<OwnerPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerPlaceholderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
