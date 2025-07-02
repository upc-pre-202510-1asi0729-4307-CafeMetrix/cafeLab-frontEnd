import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Recipe } from '../models/recipe.entity';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/AuthService';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService extends BaseService<Recipe> {
  constructor(private authService: AuthService) {
    super();
    this.resourceEndpoint = environment.recipesEndpointPath;
  }

  override getAll(): Observable<Array<Recipe>> {
    return super.getAll().pipe(
      map(recipes => recipes.filter(recipe => recipe.user_id === Number(this.authService.getCurrentUserId())))
    );
  }

  override create(recipe: Recipe): Observable<Recipe> {
    recipe.user_id = Number(this.authService.getCurrentUserId())
    return super.create(recipe);
  }

  override update(id: any, recipe: Recipe): Observable<Recipe> {
    recipe.user_id = Number(this.authService.getCurrentUserId())
    return super.update(id, recipe);
  }
}
