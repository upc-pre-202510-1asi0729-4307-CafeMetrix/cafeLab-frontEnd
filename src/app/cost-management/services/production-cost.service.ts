import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/services/AuthService';
import { ProductionCostCalculation } from '../model/production-cost.entity';

@Injectable({
  providedIn: 'root'
})
export class ProductionCostService {
  constructor(private authService: AuthService) {}

  /**
   * Calcula los costos de producción basados en los datos proporcionados
   */
  calculateProductionCost(data: {
    coffeeLotId: number;
    coffeeLotName: string;
    coffeeType: string;
    totalKg: number;
    rawMaterialsCost: number;
    laborCost: number;
    transportCost: number;
    storageCost: number;
    processingCost: number;
    otherIndirectCosts: number;
    margin: number;
  }): ProductionCostCalculation {
    const userId = Number(this.authService.getCurrentUserId());
    
    const totalDirectCost = data.rawMaterialsCost + data.laborCost;
    const totalIndirectCost = data.transportCost + data.storageCost + data.processingCost + data.otherIndirectCosts;
    const totalCost = totalDirectCost + totalIndirectCost;
    const costPerKg = data.totalKg > 0 ? totalCost / data.totalKg : 0;
    const suggestedPrice = totalCost * (1 + data.margin / 100);
    const potentialMargin = suggestedPrice - costPerKg;

    return {
      coffeeLotId: data.coffeeLotId,
      coffeeLotName: data.coffeeLotName,
      coffeeType: data.coffeeType,
      totalKg: data.totalKg,
      rawMaterialsCost: data.rawMaterialsCost,
      laborCost: data.laborCost,
      transportCost: data.transportCost,
      storageCost: data.storageCost,
      processingCost: data.processingCost,
      otherIndirectCosts: data.otherIndirectCosts,
      totalDirectCost,
      totalIndirectCost,
      totalCost,
      costPerKg,
      margin: data.margin,
      suggestedPrice,
      potentialMargin,
      calculatedAt: new Date().toISOString(),
      userId
    };
  }

  /**
   * Genera un PDF con el resumen de costos
   */
  generatePDF(costCalculation: ProductionCostCalculation): void {
    // Aquí se implementaría la generación del PDF
    // Por ahora solo simulamos la descarga
    console.log('Generando PDF para:', costCalculation);
    
    // Crear contenido del PDF
    const pdfContent = this.createPDFContent(costCalculation);
    
    // Simular descarga
    this.downloadPDF(pdfContent, `costos-produccion-${costCalculation.coffeeLotName}-${new Date().getFullYear()}.pdf`);
  }

  private createPDFContent(costCalculation: ProductionCostCalculation): string {
    return `
      RESUMEN DE COSTOS DE PRODUCCIÓN
      
      Lote: ${costCalculation.coffeeLotName}
      Tipo: ${costCalculation.coffeeType}
      Cantidad: ${costCalculation.totalKg} kg
      Fecha: ${new Date(costCalculation.calculatedAt).toLocaleDateString()}
      
      COSTOS DIRECTOS:
      - Materia Prima: S/. ${costCalculation.rawMaterialsCost.toFixed(2)}
      - Mano de Obra: S/. ${costCalculation.laborCost.toFixed(2)}
      Total Directos: S/. ${costCalculation.totalDirectCost.toFixed(2)}
      
      COSTOS INDIRECTOS:
      - Transporte: S/. ${costCalculation.transportCost.toFixed(2)}
      - Almacenamiento: S/. ${costCalculation.storageCost.toFixed(2)}
      - Procesamiento: S/. ${costCalculation.processingCost.toFixed(2)}
      - Otros: S/. ${costCalculation.otherIndirectCosts.toFixed(2)}
      Total Indirectos: S/. ${costCalculation.totalIndirectCost.toFixed(2)}
      
      RESUMEN:
      Costo Total: S/. ${costCalculation.totalCost.toFixed(2)}
      Costo por kg: S/. ${costCalculation.costPerKg.toFixed(2)}
      Margen: ${costCalculation.margin}%
      Precio Sugerido: S/. ${costCalculation.suggestedPrice.toFixed(2)}
      Margen Potencial: S/. ${costCalculation.potentialMargin.toFixed(2)}
    `;
  }

  private downloadPDF(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
