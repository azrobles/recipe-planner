package com.ara.recipeplanner.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;

import com.ara.recipeplanner.exception.EntityDuplicatedException;
import com.ara.recipeplanner.model.Ingredient;
import com.ara.recipeplanner.model.IngredientQuantity;
import com.ara.recipeplanner.model.Location;
import com.ara.recipeplanner.model.MeasureUnit;
import com.ara.recipeplanner.model.Quantity;
import com.ara.recipeplanner.model.Recipe;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class IngredientQuantityServiceTest {

  @InjectMocks
  private IngredientQuantityService service;

  @Mock
  private IngredientService ingredientService;
  @Mock
  private MeasureUnitService measureUnitService;

  @Test
  void setValidIngredientQuantitiesTest() {
    Long id = 1L;
    String name = "name";

    Ingredient ingredient = new Ingredient(id, name, null, null);
    when(ingredientService.show(id)).thenReturn(ingredient);

    MeasureUnit measureUnit = new MeasureUnit(id, name);
    when(measureUnitService.show(id)).thenReturn(measureUnit);

    Location location = new Location(id, name);
    Recipe saved = new Recipe();
    saved.setName(name);
    saved.setLocation(location);
    saved.setIngredients(new ArrayList<IngredientQuantity>(Arrays.asList(
      new IngredientQuantity(id, saved, null, null, null))));

    IngredientQuantity ingredientQuantity = new IngredientQuantity(null, null,
      new Ingredient(id, null, null, null),
      new Quantity(new BigDecimal(1), new MeasureUnit(id, null)), false);
    Recipe entity = new Recipe();
    entity.setIngredients(Arrays.asList(ingredientQuantity));

    service.setValidIngredientQuantities(entity, saved);

    assertEquals(1, saved.getIngredients().size());

    saved.getIngredients().stream()
      .forEach(e -> {
        assertNotNull(e.getIngredient().getName());
        assertNotNull(e.getQuantity().getMeasureUnit().getName());
        assertEquals(saved, e.getRecipe());
      });
  }

  @Test
  void setValidIngredientQuantitiesEntityDuplicatedExceptionTest() {
    Long id = 1L;
    String name = "name";

    Ingredient ingredient = new Ingredient(id, name, null, null);
    when(ingredientService.show(id)).thenReturn(ingredient);

    MeasureUnit measureUnit = new MeasureUnit(id, name);
    when(measureUnitService.show(id)).thenReturn(measureUnit);

    Location location = new Location(id, name);
    Recipe saved = new Recipe();
    saved.setName(name);
    saved.setLocation(location);
    IngredientQuantity ingredientQuantitySaved = new IngredientQuantity(id,
      saved, ingredient, new Quantity(new BigDecimal(1), measureUnit), false);
    saved.setIngredients(new ArrayList<IngredientQuantity>(Arrays.asList(
      ingredientQuantitySaved)));

    IngredientQuantity ingredientQuantity = new IngredientQuantity(null, null,
      new Ingredient(id, null, null, null),
      new Quantity(new BigDecimal(1), new MeasureUnit(id, null)), false);
    Recipe entity = new Recipe();
    entity.setIngredients(Arrays.asList(
      ingredientQuantitySaved, ingredientQuantity));

    assertThrows(EntityDuplicatedException.class,
      () -> service.setValidIngredientQuantities(entity, saved));
  }

  @Test
  void setValidIngredientQuantitiesNewTest() {
    Long id = 1L;
    String name = "name";

    Ingredient ingredient = new Ingredient(id, name, null, null);
    when(ingredientService.show(id)).thenReturn(ingredient);

    MeasureUnit measureUnit = new MeasureUnit(id, name);
    when(measureUnitService.show(id)).thenReturn(measureUnit);

    IngredientQuantity ingredientQuantity = new IngredientQuantity(null, null,
      new Ingredient(id, null, null, null),
      new Quantity(new BigDecimal(1), new MeasureUnit(id, null)), false);
    Recipe entity = new Recipe();
    entity.setIngredients(Arrays.asList(ingredientQuantity));

    service.setValidIngredientQuantities(entity, null);

    assertEquals(1, entity.getIngredients().size());

    entity.getIngredients().stream()
      .forEach(e -> {
        assertNotNull(e.getIngredient().getName());
        assertNotNull(e.getQuantity().getMeasureUnit().getName());
        assertEquals(entity, e.getRecipe());
      });
  }

  @Test
  void setValidIngredientQuantitiesNewEntityDuplicatedExceptionTest() {
    Long id = 1L;
    String name = "name";

    Ingredient ingredient = new Ingredient(id, name, null, null);
    when(ingredientService.show(id)).thenReturn(ingredient);

    MeasureUnit measureUnit = new MeasureUnit(id, name);
    when(measureUnitService.show(id)).thenReturn(measureUnit);

    IngredientQuantity ingredientQuantity = new IngredientQuantity(null, null,
      new Ingredient(id, null, null, null),
      new Quantity(new BigDecimal(1), new MeasureUnit(id, null)), false);
    Recipe entity = new Recipe();
    entity.setIngredients(Arrays.asList(ingredientQuantity,ingredientQuantity));

    assertThrows(EntityDuplicatedException.class,
      () -> service.setValidIngredientQuantities(entity, null));
  }

}
