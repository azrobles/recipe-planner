package com.ara.recipeplanner.dto;

import com.ara.recipeplanner.model.Ingredient;

public class IngredientDtoMapper {

  private IngredientDtoMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static IngredientDto toDto(Ingredient model) {
    if (model == null) {
      return null;
    }

    IngredientDto dto = new IngredientDto();
    dto.setId(model.getId());
    dto.setName(model.getName());
    dto.setAvailability(AvailabilityDtoMapper.toDto(model.getAvailability()));
    dto.setSupermarket(SupermarketDtoMapper.toDto(model.getSupermarket()));

    return dto;
  }

  public static Ingredient toModel(IngredientDto dto) {
    if (dto == null) {
      return null;
    }

    return new Ingredient(dto.getId(), dto.getName(),
        AvailabilityDtoMapper.toModel(dto.getAvailability()),
        SupermarketDtoMapper.toModel(dto.getSupermarket()));
  }

}
