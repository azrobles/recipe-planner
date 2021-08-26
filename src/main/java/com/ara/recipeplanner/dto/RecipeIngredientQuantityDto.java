package com.ara.recipeplanner.dto;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.validation.Valid;
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;

public class RecipeIngredientQuantityDto implements Serializable {

  private static final long serialVersionUID = 1L;

  private Long id;

  @NotNull
  @Valid
  private IngredientDto ingredient;

  @NotNull
  @Digits(integer = 6, fraction = 4)
  private BigDecimal amount;

  @NotNull
  @Valid
  private MeasureUnitDto measureUnit;

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

  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }

  public MeasureUnitDto getMeasureUnit() {
    return measureUnit;
  }

  public void setMeasureUnit(MeasureUnitDto measureUnit) {
    this.measureUnit = measureUnit;
  }

  public Boolean getOptional() {
    return optional;
  }

  public void setOptional(Boolean optional) {
    this.optional = optional;
  }

}
