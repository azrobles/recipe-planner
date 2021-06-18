import { Ingredient } from "./ingredient.model";
import { Quantity } from "./quantity.model";

export interface RecipeIngredientQuantity {
  id?: number;
  ingredient: Ingredient;
  quantity: Quantity;
  optional: boolean;
}
