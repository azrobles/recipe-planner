package com.ara.recipeplanner.dto;

import com.ara.recipeplanner.model.RecipeType;

public class RecipeTypeDtoMapper {

  private RecipeTypeDtoMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static RecipeTypeDto toDto(RecipeType model) {
    if (model == null) {
      return null;
    }

    var dto = new RecipeTypeDto();
    dto.setId(model.getId());
    dto.setName(model.getName());

    return dto;
  }

  public static RecipeType toModel(RecipeTypeDto dto) {
    if (dto == null) {
      return null;
    }

    return new RecipeType(dto.getId(), dto.getName());
  }

}
