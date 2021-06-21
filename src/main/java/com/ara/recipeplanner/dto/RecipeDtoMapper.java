package com.ara.recipeplanner.dto;

import java.util.stream.Collectors;

import com.ara.recipeplanner.model.Recipe;

public class RecipeDtoMapper {

  private RecipeDtoMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static RecipeDto toDto(Recipe model) {
    if (model == null) {
      return null;
    }

    var dto = new RecipeDto();
    dto.setId(model.getId());
    dto.setName(model.getName());
    dto.setLocation(LocationDtoMapper.toDto(model.getLocation()));
    dto.setType(RecipeTypeDtoMapper.toDto(model.getType()));
    dto.setSeason(SeasonDtoMapper.toDto(model.getSeason()));
    dto.setDifficulty(DifficultyDtoMapper.toDto(model.getDifficulty()));
    dto.setFrequency(model.getFrequency());

    dto.setIngredients(model.getIngredients().stream()
      .map(RecipeIngredientQuantityDtoMapper::toDto)
      .collect(Collectors.toList()));

    return dto;
  }

  public static Recipe toModel(RecipeDto dto) {
    if (dto == null) {
      return null;
    }

    var recipe =  new Recipe();
    recipe.setId(dto.getId());
    recipe.setName(dto.getName());
    recipe.setLocation(LocationDtoMapper.toModel(dto.getLocation()));
    recipe.setType(RecipeTypeDtoMapper.toModel(dto.getType()));
    recipe.setSeason(SeasonDtoMapper.toModel(dto.getSeason()));
    recipe.setDifficulty(DifficultyDtoMapper.toModel(dto.getDifficulty()));
    recipe.setFrequency(dto.getFrequency());

    recipe.setIngredients(dto.getIngredients().stream()
      .map(RecipeIngredientQuantityDtoMapper::toModel)
      .map(iq -> {
        iq.setRecipe(recipe);
        return iq;
      })
      .collect(Collectors.toList()));

    return recipe;
  }

}
