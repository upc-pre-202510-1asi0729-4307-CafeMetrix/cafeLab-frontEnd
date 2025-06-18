import { Defect } from '../../model/defect.entity'
import { DefectResource, DefectsResponse } from '../responses/defect.response';

export class DefectAssembler {
  static toEntitiesFromResponse(response: DefectResource[]): Defect[] {
    if (!response) {
      return [];
    }
    return response.map((defect: DefectResource) => this.toEntityFromResource(defect));
  }

  static toEntityFromResource(resource: DefectResource): Defect {
    return new Defect({
      id: resource.id,
      coffeeId: resource.coffeeId ? resource.coffeeId.toString() : '',
      name: resource.name,
      defectType: resource.defectType,
      defectWeight: resource.defectWeight,
      percentage: resource.percentage,
      probableCause: resource.probableCause,
      suggestedSolution: resource.suggestedSolution
    });
  }

  static toResourceFromEntity(entity: Defect): DefectResource {
    return {
      id: entity.id,
      coffeeId: entity.coffeeId,
      name: entity.name,
      defectType: entity.defectType,
      defectWeight: entity.defectWeight,
      percentage: entity.percentage,
      probableCause: entity.probableCause,
      suggestedSolution: entity.suggestedSolution
    };
  }
}
