package com.ara.recipeplanner.dto;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.validation.Valid;
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;

public class DurationDto implements Serializable {

  private static final long serialVersionUID = 1L;

  @NotNull
  @Digits(integer = 6, fraction = 4)
  private BigDecimal amount;

  @NotNull
  @Valid
  private TimeUnitDto timeUnit;

  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }

  public TimeUnitDto getTimeUnit() {
    return timeUnit;
  }

  public void setTimeUnit(TimeUnitDto timeUnit) {
    this.timeUnit = timeUnit;
  }

}
