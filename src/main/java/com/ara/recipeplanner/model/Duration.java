package com.ara.recipeplanner.model;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Embeddable
public class Duration {

  @Column(nullable = false, precision = 10, scale = 4)
  private BigDecimal amount;

  @ManyToOne
  @JoinColumn(nullable = false)
  private TimeUnit timeUnit;

  public Duration() {}

  public Duration(BigDecimal amount, TimeUnit timeUnit) {
    this.amount = amount;
    this.timeUnit = timeUnit;
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }

  public TimeUnit getTimeUnit() {
    return timeUnit;
  }

  public void setTimeUnit(TimeUnit timeUnit) {
    this.timeUnit = timeUnit;
  }

  @Override
  public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + ((amount == null) ? 0 : amount.hashCode());
    result = prime * result + ((timeUnit == null) ? 0 : timeUnit.hashCode());
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
    Duration other = (Duration) obj;
    if (amount == null) {
      if (other.amount != null)
        return false;
    } else if (!amount.equals(other.amount))
      return false;
    if (timeUnit == null) {
      if (other.timeUnit != null)
        return false;
    } else if (!timeUnit.equals(other.timeUnit))
      return false;
    return true;
  }

  @Override
  public String toString() {
    return "Duration [amount=" + amount + ", timeUnit=" + timeUnit + "]";
  }

}
