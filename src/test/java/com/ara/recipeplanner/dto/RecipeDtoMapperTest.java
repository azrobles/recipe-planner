package com.ara.recipeplanner.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.ara.recipeplanner.model.Difficulty;
import com.ara.recipeplanner.model.Ingredient;
import com.ara.recipeplanner.model.Location;
import com.ara.recipeplanner.model.Quantity;
import com.ara.recipeplanner.model.Recipe;
import com.ara.recipeplanner.model.RecipeType;
import com.ara.recipeplanner.model.Season;

import org.junit.jupiter.api.Test;

class RecipeDtoMapperTest {

  @Test
  void toDtoTest() {
    Recipe model = new Recipe();
    model.setId(1L);
    model.setName("name");
    model.setLocation(new Location());
    model.setType(new RecipeType());
    model.setSeason(new Season());
    model.setDifficulty(new Difficulty());
    model.setFrequency(1L);

    model.addIngredient(new Ingredient(), new Quantity(), false);

    RecipeDto dto = RecipeDtoMapper.toDto(model);

    assertEquals(model.getId(), dto.getId());
    assertEquals(model.getName(), dto.getName());
    assertNotNull(dto.getLocation());
    assertNotNull(dto.getType());
    assertNotNull(dto.getSeason());
    assertNotNull(dto.getDifficulty());
    assertEquals(model.getFrequency(), dto.getFrequency());

    assertEquals(model.getIngredients().size(), dto.getIngredients().size());
  }

  @Test
  void toModelTest() {
    RecipeDto dto = new RecipeDto();
    dto.setId(1L);
    dto.setName("name");
    dto.setLocation(new LocationDto());
    dto.setType(new RecipeTypeDto());
    dto.setSeason(new SeasonDto());
    dto.setDifficulty(new DifficultyDto());
    dto.setFrequency(1L);

    dto.getIngredients().add(new RecipeIngredientQuantityDto());

    Recipe model = RecipeDtoMapper.toModel(dto);

    assertEquals(dto.getId(), model.getId());
    assertEquals(dto.getName(), model.getName());
    assertNotNull(model.getLocation());
    assertNotNull(model.getType());
    assertNotNull(model.getSeason());
    assertNotNull(model.getDifficulty());
    assertEquals(dto.getFrequency(), model.getFrequency());

    assertEquals(dto.getIngredients().size(), model.getIngredients().size());
    assertTrue(model.getIngredients().stream().allMatch(
      iq -> iq.getRecipe() == model));
  }

}
