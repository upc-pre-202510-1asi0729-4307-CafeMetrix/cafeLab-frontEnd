export type CoffeesResponse = CoffeeResource[];

export interface CoffeeResource {
  id: string; // Cambiado de number a string
  name: string;
  region: string;
  variety: string;
  totalWeight: number;
  userId: string; // Asegúrate de incluir userId si lo usas en el backend
}
