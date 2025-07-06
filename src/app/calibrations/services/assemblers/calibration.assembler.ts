import { Calibration } from '../../model/calibration.entity';
import { CalibrationResource } from '../responses/calibration.response';

export class CalibrationAssembler {
  static toEntitiesFromResponse(response: CalibrationResource[]): Calibration[] {
    if (!response) return [];
    return response.map((cal: CalibrationResource) => this.toEntityFromResource(cal));
  }

  static toEntityFromResource(resource: CalibrationResource): Calibration {
    return new Calibration({
      id: resource.id,
      name: resource.name, // <-- Agrega esto
      method: resource.method,
      equipment: resource.equipment,
      grindNumber: resource.grindNumber,
      aperture: resource.aperture,
      cupVolume: resource.cupVolume,
      finalVolume: resource.finalVolume,
      calibrationDate: resource.calibrationDate,
      comments: resource.comments,
      notes: resource.notes,
      userId: resource.userId,
      sampleImage: resource.sampleImage // <-- Agrega esto si usas imagen
    });
  }

  static toResourceFromEntity(entity: Calibration): CalibrationResource {
    return {
      id: entity.id,
      name: entity.name, // <-- Agrega esto
      method: entity.method,
      equipment: entity.equipment,
      grindNumber: entity.grindNumber,
      aperture: entity.aperture,
      cupVolume: entity.cupVolume,
      finalVolume: entity.finalVolume,
      calibrationDate: entity.calibrationDate,
      comments: entity.comments,
      notes: entity.notes,
      userId: entity.userId,
      sampleImage: entity.sampleImage // <-- Agrega esto si usas imagen
    };
  }
}
