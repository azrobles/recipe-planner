package com.ara.recipeplanner.dto;

import java.io.Serializable;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

public class RecipeIngredientQuantityDto implements Serializable {

  private static final long serialVersionUID = 1L;

  private Long id;

  @NotNull
  @Valid
  private IngredientDto ingredient;

  @NotNull
  private QuantityDto quantity;

  @NotNull
  private Boolean optional;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public IngredientDto getIngredient() {
    return ingredient;
  }

  public void setIngredient(IngredientDto ingredient) {
    this.ingredient = ingredient;
  }

  public QuantityDto getQuantity() {
    return quantity;
  }

  public void setQuantity(QuantityDto quantity) {
    this.quantity = quantity;
  }

  public Boolean getOptional() {
    return optional;
  }

  public void setOptional(Boolean optional) {
    this.optional = optional;
  }

}
