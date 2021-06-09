package com.ara.recipeplanner.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import com.ara.recipeplanner.model.Ingredient;
import com.ara.recipeplanner.model.IngredientQuantity;
import com.ara.recipeplanner.model.Quantity;
import com.ara.recipeplanner.model.Recipe;

import org.junit.jupiter.api.Test;

class RecipeIngredientQuantityDtoMapperTest {

  @Test
  void toDtoTest() {
    IngredientQuantity model = new IngredientQuantity(1L, new Recipe(),
        new Ingredient(), new Quantity(), false);

    RecipeIngredientQuantityDto dto = RecipeIngredientQuantityDtoMapper
      .toDto(model);

    assertEquals(model.getId(), dto.getId());
    assertNotNull(dto.getIngredient());
    assertNotNull(dto.getQuantity());
    assertEquals(model.getOptional(), dto.getOptional());
  }

  @Test
  void toModelTest() {
    RecipeIngredientQuantityDto dto = new RecipeIngredientQuantityDto();
    dto.setId(1L);
    dto.setIngredient(new IngredientDto());
    dto.setQuantity(new QuantityDto());
    dto.setOptional(false);

    IngredientQuantity model = RecipeIngredientQuantityDtoMapper.toModel(dto);

    assertEquals(dto.getId(), model.getId());
    assertNull(model.getRecipe());
    assertNotNull(model.getIngredient());
    assertNotNull(model.getQuantity());
    assertEquals(dto.getOptional(), model.getOptional());
  }

}
