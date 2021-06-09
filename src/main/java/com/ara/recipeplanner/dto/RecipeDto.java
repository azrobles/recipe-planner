package com.ara.recipeplanner.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class RecipeDto implements Serializable {

  private static final long serialVersionUID = 1L;

  private Long id;

  @NotBlank
  @Size(min = 1, max = 100)
  private String name;

  @NotNull
  @Valid
  private LocationDto location;

  @NotNull
  @Valid
  private RecipeTypeDto type;

  @NotNull
  @Valid
  private SeasonDto season;

  @NotNull
  @Valid
  private DifficultyDto difficulty;

  @Valid
  private DurationDto duration;

  @NotNull
  private Long frequency;

  private List<RecipeIngredientQuantityDto> ingredients = new ArrayList<>();

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

  public LocationDto getLocation() {
    return location;
  }

  public void setLocation(LocationDto location) {
    this.location = location;
  }

  public RecipeTypeDto getType() {
    return type;
  }

  public void setType(RecipeTypeDto type) {
    this.type = type;
  }

  public SeasonDto getSeason() {
    return season;
  }

  public void setSeason(SeasonDto season) {
    this.season = season;
  }

  public DifficultyDto getDifficulty() {
    return difficulty;
  }

  public void setDifficulty(DifficultyDto difficulty) {
    this.difficulty = difficulty;
  }

  public DurationDto getDuration() {
    return duration;
  }

  public void setDuration(DurationDto duration) {
    this.duration = duration;
  }

  public Long getFrequency() {
    return frequency;
  }

  public void setFrequency(Long frequency) {
    this.frequency = frequency;
  }

  public List<RecipeIngredientQuantityDto> getIngredients() {
    return ingredients;
  }

  public void setIngredients(List<RecipeIngredientQuantityDto> ingredients) {
    this.ingredients = ingredients;
  }

}
