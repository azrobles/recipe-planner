import { Difficulty } from "./difficulty.model";
import { Duration } from "./duration.model";
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
  duration?: Duration;
  frequency: number;
  ingredients: RecipeIngredientQuantity[];
}
