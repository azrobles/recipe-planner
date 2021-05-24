package com.ara.recipeplanner.model;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Embeddable
public class Quantity {

  @Column(nullable = false, precision = 10, scale = 4)
  private BigDecimal amount;

  @ManyToOne
  @JoinColumn(nullable = false)
  private MeasureUnit measureUnit;

  public Quantity() {}

  public Quantity(BigDecimal amount, MeasureUnit measureUnit) {
    this.amount = amount;
    this.measureUnit = measureUnit;
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }

  public MeasureUnit getMeasureUnit() {
    return measureUnit;
  }

  public void setMeasureUnit(MeasureUnit measureUnit) {
    this.measureUnit = measureUnit;
  }

  @Override
  public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + ((amount == null) ? 0 : amount.hashCode());
    result = prime * result + ((measureUnit == null) ? 0 : measureUnit.hashCode());
    return result;
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj)
      return true;
    if (obj == null)
      return false;
    if (getClass() != obj.getClass())
      return false;
    Quantity other = (Quantity) obj;
    if (amount == null) {
      if (other.amount != null)
        return false;
    } else if (!amount.equals(other.amount))
      return false;
    if (measureUnit == null) {
      if (other.measureUnit != null)
        return false;
    } else if (!measureUnit.equals(other.measureUnit))
      return false;
    return true;
  }

  @Override
  public String toString() {
    return "Quantity [amount=" + amount + ", measureUnit=" + measureUnit + "]";
  }

}
