package com.ara.recipeplanner.dto;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.validation.Valid;
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;

public class QuantityDto implements Serializable {

  private static final long serialVersionUID = 1L;

  @NotNull
  @Digits(integer = 6, fraction = 4)
  private BigDecimal amount;

  @NotNull
  @Valid
  private MeasureUnitDto measureUnit;

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

}
