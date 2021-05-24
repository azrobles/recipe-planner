package com.ara.recipeplanner.model;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.persistence.AssociationOverride;
import javax.persistence.AttributeOverride;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(uniqueConstraints =
    @UniqueConstraint(columnNames = { "name", "location_id" }))
public class Recipe {

  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 100)
  private String name;

  @ManyToOne(optional=false)
  private Location location;

  @ManyToOne(optional=false)
  private RecipeType type;

  @ManyToOne(optional=false)
  private Season season;

  @ManyToOne(optional=false)
  private Difficulty difficulty;

  @Embedded
  @AttributeOverride(name = "amount", column = @Column(nullable = true))
  @AssociationOverride(
    name = "timeUnit",
    joinColumns = @JoinColumn(nullable = true)
  )
  private Duration duration;

  @Column(nullable = false)
  private Long frequency;

  @OneToMany(
    mappedBy = "recipe",
    cascade = CascadeType.ALL,
    orphanRemoval = true
  )
  private List<IngredientQuantity> ingredients = new ArrayList<>();

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

  public Location getLocation() {
    return location;
  }

  public void setLocation(Location location) {
    this.location = location;
  }

  public RecipeType getType() {
    return type;
  }

  public void setType(RecipeType type) {
    this.type = type;
  }

  public Season getSeason() {
    return season;
  }

  public void setSeason(Season season) {
    this.season = season;
  }

  public Difficulty getDifficulty() {
    return difficulty;
  }

  public void setDifficulty(Difficulty difficulty) {
    this.difficulty = difficulty;
  }

  public Duration getDuration() {
    return duration;
  }

  public void setDuration(Duration duration) {
    this.duration = duration;
  }

  public Long getFrequency() {
    return frequency;
  }

  public void setFrequency(Long frequency) {
    this.frequency = frequency;
  }

  public List<IngredientQuantity> getIngredients() {
    return ingredients;
  }

  public void setIngredients(List<IngredientQuantity> ingredients) {
    this.ingredients = ingredients;
  }

  public void addIngredient(Ingredient ingredient, Quantity quantity,
      Boolean optional) {

    var ingredientQuantity = new IngredientQuantity(
        null, this, ingredient, quantity, optional);
    this.ingredients.add(ingredientQuantity);
  }

  public void removeIngredient(Long ingredientQuantityId) {

    for (Iterator<IngredientQuantity> iterator = this.ingredients.iterator();
        iterator.hasNext(); ) {

      var ingredientQuantity = iterator.next();

      if (ingredientQuantity.getRecipe().equals(this)
          && ingredientQuantity.getId().equals(ingredientQuantityId)) {

        iterator.remove();
        ingredientQuantity.setRecipe(null);
      }
    }
  }

  @Override
  public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + ((location == null) ? 0 : location.hashCode());
    result = prime * result + ((name == null) ? 0 : name.hashCode());
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
    Recipe other = (Recipe) obj;
    if (location == null) {
      if (other.location != null)
        return false;
    } else if (!location.equals(other.location))
      return false;
    if (name == null) {
      if (other.name != null)
        return false;
    } else if (!name.equals(other.name))
      return false;
    return true;
  }

  @Override
  public String toString() {
    return "Recipe [id=" + id + ", name=" + name
        + ", location=" + location.getName()
        + ", type=" + type.getName()
        + ", season=" + season.getName()
        + ", difficulty=" + difficulty.getName()
        + ", duration=" + duration
        + ", frequency=" + frequency
        + ", ingredients=" + ingredients + "]";
  }

}
