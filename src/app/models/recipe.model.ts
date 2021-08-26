import { Difficulty } from "./difficulty.model";
import { Location } from "./location.model";
import { RecipeIngredient } from "./recipe-ingredient.model";
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
  ingredients?: RecipeIngredient[];
}
