import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePortfolioDialogComponent } from './create-portfolio-dialog.component';

describe('CreatePortfolioDialogComponent', () => {
  let component: CreatePortfolioDialogComponent;
  let fixture: ComponentFixture<CreatePortfolioDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePortfolioDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePortfolioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
