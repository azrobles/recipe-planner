package com.ara.recipeplanner.dto;

import java.io.Serializable;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class IngredientDto implements Serializable {

  private static final long serialVersionUID = 1L;

  private Long id;

  @NotBlank
  @Size(min = 1, max = 50)
  private String name;

  @NotNull
  @Valid
  private AvailabilityDto availability;

  @NotNull
  @Valid
  private SupermarketDto supermarket;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public AvailabilityDto getAvailability() {
    return availability;
  }

  public void setAvailability(AvailabilityDto availability) {
    this.availability = availability;
  }

  public SupermarketDto getSupermarket() {
    return supermarket;
  }

  public void setSupermarket(SupermarketDto supermarket) {
    this.supermarket = supermarket;
  }

}
