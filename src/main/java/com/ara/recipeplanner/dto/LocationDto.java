package com.ara.recipeplanner.dto;

import java.io.Serializable;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class LocationDto implements Serializable {

  private static final long serialVersionUID = 1L;

  private Long id;

  @NotBlank
  @Size(min = 1, max = 50)
  private String name;

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

}
