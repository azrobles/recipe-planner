import { Difficulty } from "./difficulty.model";
import { Location } from "./location.model";
import { RecipeIngredientQuantity } from "./recipe-ingredient-quantity.model";
import { RecipeType } from "./recipe-type.model";
import { Season } from "./season.model";

export interface Recipe {
  id?: number;
  name: string;
  location: Location;
  type: RecipeType;
  season: Season;
  difficulty: Difficulty;
  frequency: number;
  ingredients?: RecipeIngredientQuantity[];
}
