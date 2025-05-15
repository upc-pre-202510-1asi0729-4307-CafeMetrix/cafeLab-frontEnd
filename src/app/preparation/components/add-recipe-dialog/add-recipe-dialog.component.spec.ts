import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecipeDialogComponent } from './add-recipe-dialog.component';

describe('AddRecipeDialogComponent', () => {
  let component: AddRecipeDialogComponent;
  let fixture: ComponentFixture<AddRecipeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRecipeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRecipeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
