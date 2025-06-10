import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationCardsComponent } from './recommendation-cards.component';

describe('RecommendationCardsComponent', () => {
  let component: RecommendationCardsComponent;
  let fixture: ComponentFixture<RecommendationCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendationCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendationCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
