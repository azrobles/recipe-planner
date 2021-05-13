import { Availability } from "./availability.model";
import { Supermarket } from "./supermarket.model";

export interface Ingredient {
  id?: number;
  name: string;
  availability: Availability;
  supermarket: Supermarket;
}
