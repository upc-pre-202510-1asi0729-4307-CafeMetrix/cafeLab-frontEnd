import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletePlaceholderComponent } from './complete-placeholder.component';

describe('CompletePlaceholderComponent', () => {
  let component: CompletePlaceholderComponent;
  let fixture: ComponentFixture<CompletePlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletePlaceholderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletePlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
