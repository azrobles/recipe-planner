package com.ara.recipeplanner.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.ara.recipeplanner.model.RecipeType;

import org.junit.jupiter.api.Test;

class RecipeTypeDtoMapperTest {

  @Test
  void toDtoTest() {
    RecipeType model = new RecipeType(1L, "name");

    RecipeTypeDto dto = RecipeTypeDtoMapper.toDto(model);

    assertEquals(model.getId(), dto.getId());
    assertEquals(model.getName(), dto.getName());
  }

  @Test
  void toModelTest() {
    RecipeTypeDto dto = new RecipeTypeDto();
    dto.setId(1L);
    dto.setName("name");

    RecipeType model = RecipeTypeDtoMapper.toModel(dto);

    assertEquals(dto.getId(), model.getId());
    assertEquals(dto.getName(), model.getName());
  }

}
