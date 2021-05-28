package com.ara.recipeplanner.service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import com.ara.recipeplanner.exception.EntityDuplicatedException;
import com.ara.recipeplanner.model.Ingredient;
import com.ara.recipeplanner.model.IngredientQuantity;
import com.ara.recipeplanner.model.Quantity;
import com.ara.recipeplanner.model.Recipe;

import org.springframework.stereotype.Service;

@Service
public class IngredientQuantityService {

  private final IngredientService ingredientService;
  private final MeasureUnitService measureUnitService;

  public IngredientQuantityService(IngredientService ingredientService,
      MeasureUnitService measureUnitService) {

    this.ingredientService = ingredientService;
    this.measureUnitService = measureUnitService;
  }

  public void setValidIngredientQuantities(Recipe entity, Recipe saved)
      throws EntityDuplicatedException {

    entity.getIngredients().stream().forEach( e -> {
      e = getValidIngredientQuantity(e);
      e.setRecipe(entity);
    });

    checkIngredientQuantityListDuplicated(entity.getIngredients());

    if (saved != null) {

      List<IngredientQuantity> list = entity.getIngredients().stream()
      .map(e -> new IngredientQuantity(
        e.getId(), saved, e.getIngredient(), e.getQuantity(), e.getOptional()))
      .collect(Collectors.toList());

      removeIngredientQuantities(list, saved);

      addIngredientQuantities(list, saved);
    }
  }

  private IngredientQuantity getValidIngredientQuantity(
      IngredientQuantity entity) {

    entity.setIngredient(getValidIngredient(entity));
    entity.setQuantity(getValidQuantity(entity));

    return entity;
  }

  private Ingredient getValidIngredient(IngredientQuantity entity) {

    return ingredientService.show(
      entity.getIngredient() != null ? entity.getIngredient().getId() : null);
  }

  private Quantity getValidQuantity(IngredientQuantity entity) {

    if (entity.getQuantity() != null) {

      entity.getQuantity().setMeasureUnit(measureUnitService.show(
        entity.getQuantity().getMeasureUnit() != null ?
          entity.getQuantity().getMeasureUnit().getId() : null));
    }

    return entity.getQuantity();
  }

  private void checkIngredientQuantityListDuplicated(
      List<IngredientQuantity> list) throws EntityDuplicatedException {

    for (IngredientQuantity item : list) {

      if (Collections.frequency(list, item) > 1) {

        throwEntityDuplicatedException(item);
      }
    }
  }

  private void removeIngredientQuantities(List<IngredientQuantity> list,
      Recipe saved) {

    saved.getIngredients().stream()
      .filter(e -> !list.contains(e))
      .collect(Collectors.toList())
      .forEach(e -> saved.removeIngredient(e.getId()));
  }

  private void addIngredientQuantities(List<IngredientQuantity> list,
      Recipe saved) throws EntityDuplicatedException {

    list.stream()
      .filter(e -> saved.getIngredients().stream().filter(s ->
        Objects.equals(s.getId(), e.getId())).count() == 0)
      .forEach(e -> {

        checkIngredientQuantityDuplicated(e, saved.getIngredients());

        saved.addIngredient(
          e.getIngredient(), e.getQuantity(), e.getOptional());
      });
  }

  private void checkIngredientQuantityDuplicated(IngredientQuantity entity,
      List<IngredientQuantity> list) throws EntityDuplicatedException {

    for (IngredientQuantity item : list) {

      if (item.equals(entity) && !Objects.equals(item.getId(), entity.getId())){

        throwEntityDuplicatedException(entity);
      }
    }
  }

  private void throwEntityDuplicatedException(IngredientQuantity entity)
      throws EntityDuplicatedException {

    throw new EntityDuplicatedException((entity.getIngredient() != null ?
      entity.getIngredient().getName() : "ingredient") + " quantity");
  }

}
