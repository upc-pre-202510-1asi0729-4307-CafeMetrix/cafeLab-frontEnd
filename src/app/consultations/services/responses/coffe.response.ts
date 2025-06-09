export interface CoffeesResponse {
  status: string
  coffees: CoffeeResource[]
}
export interface CoffeeResource {
  id: number
  name: string
  region: string
  variety: string
  totalWeight: number
}
