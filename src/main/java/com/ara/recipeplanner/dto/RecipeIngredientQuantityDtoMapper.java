package com.ara.recipeplanner.dto;

import com.ara.recipeplanner.model.IngredientQuantity;

public class RecipeIngredientQuantityDtoMapper {

  private RecipeIngredientQuantityDtoMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static RecipeIngredientQuantityDto toDto(IngredientQuantity model) {
    if (model == null) {
      return null;
    }

    var dto = new RecipeIngredientQuantityDto();
    dto.setId(model.getId());
    dto.setIngredient(IngredientDtoMapper.toDto(model.getIngredient()));
    dto.setQuantity(QuantityDtoMapper.toDto(model.getQuantity()));
    dto.setOptional(model.getOptional());

    return dto;
  }

  public static IngredientQuantity toModel(RecipeIngredientQuantityDto dto) {
    if (dto == null) {
      return null;
    }

    return new IngredientQuantity(dto.getId(), null,
        IngredientDtoMapper.toModel(dto.getIngredient()),
        QuantityDtoMapper.toModel(dto.getQuantity()), dto.getOptional());
  }

}
