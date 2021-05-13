package com.ara.recipeplanner.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.ara.recipeplanner.model.Availability;
import com.ara.recipeplanner.model.Ingredient;
import com.ara.recipeplanner.model.Supermarket;

import org.junit.jupiter.api.Test;

class IngredientDtoMapperTest {

  @Test
  void toDtoTest() {
    Ingredient model = new Ingredient(1L, "name", new Availability(),
        new Supermarket());

    IngredientDto dto = IngredientDtoMapper.toDto(model);

    assertEquals(model.getId(), dto.getId());
    assertEquals(model.getName(), dto.getName());
    assertNotNull(dto.getAvailability());
    assertNotNull(dto.getSupermarket());
  }

  @Test
  void toModelTest() {
    IngredientDto dto = new IngredientDto();
    dto.setId(1L);
    dto.setName("name");
    dto.setAvailability(new AvailabilityDto());
    dto.setSupermarket(new SupermarketDto());

    Ingredient model = IngredientDtoMapper.toModel(dto);

    assertEquals(dto.getId(), model.getId());
    assertEquals(dto.getName(), model.getName());
    assertNotNull(model.getAvailability());
    assertNotNull(model.getSupermarket());
  }

}
