import { Ingredient } from "./ingredient.model";
import { MeasureUnit } from "./measure-unit.model";

export interface RecipeIngredient {
  id?: number;
  ingredient: Ingredient;
  amount: number;
  measureUnit: MeasureUnit;
  optional: boolean;
}
