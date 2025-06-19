import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationsCardComponent } from './recommendation-cards.component';

describe('RecommendationCardsComponent', () => {
  let component: RecommendationsCardComponent;
  let fixture: ComponentFixture<RecommendationsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendationsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendationsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
