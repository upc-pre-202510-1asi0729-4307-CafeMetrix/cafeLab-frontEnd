import { Coffee } from '../../model/coffe.entity';
import { CoffeeResource, CoffeesResponse } from '../responses/coffe.response';

export class CoffeeAssembler {
  static toEntitiesFromResponse(response: CoffeeResource[]): Coffee[] {
    if (!response) {
      return [];
    }
    return response.map((coffee: CoffeeResource) => this.toEntityFromResource(coffee));
  }


  static toEntityFromResource(resource: CoffeeResource): Coffee {
    return new Coffee({
      id: resource.id,
      name: resource.name,
      region: resource.region,
      variety: resource.variety,
      totalWeight: resource.totalWeight
    });
  }

  static toResourceFromEntity(entity: Coffee): CoffeeResource {
    return {
      id: entity.id,
      name: entity.name,
      region: entity.region,
      variety: entity.variety,
      totalWeight: entity.totalWeight
    };
  }
}
