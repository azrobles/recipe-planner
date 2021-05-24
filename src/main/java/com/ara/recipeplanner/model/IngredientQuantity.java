package com.ara.recipeplanner.model;

import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(uniqueConstraints =
    @UniqueConstraint(
        columnNames = {"recipe_id","ingredient_id","measure_unit_id","optional"}
    )
)
public class IngredientQuantity {

  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional=false)
  private Recipe recipe;

  @ManyToOne(fetch = FetchType.LAZY, optional=false)
  private Ingredient ingredient;

  @Embedded
  private Quantity quantity;

  @Column(nullable = false)
  private Boolean optional;

  public IngredientQuantity() {}

  public IngredientQuantity(Long id, Recipe recipe, Ingredient ingredient, Quantity quantity, Boolean optional) {
    this.id = id;
    this.recipe = recipe;
    this.ingredient = ingredient;
    this.quantity = quantity;
    this.optional = optional;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Recipe getRecipe() {
    return recipe;
  }

  public void setRecipe(Recipe recipe) {
    this.recipe = recipe;
  }

  public Ingredient getIngredient() {
    return ingredient;
  }

  public void setIngredient(Ingredient ingredient) {
    this.ingredient = ingredient;
  }

  public Quantity getQuantity() {
    return quantity;
  }

  public void setQuantity(Quantity quantity) {
    this.quantity = quantity;
  }

  public Boolean getOptional() {
    return optional;
  }

  public void setOptional(Boolean optional) {
    this.optional = optional;
  }

  @Override
  public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + ((ingredient == null) ? 0 : ingredient.hashCode());
    result = prime * result + ((optional == null) ? 0 : optional.hashCode());
    result = prime * result + ((quantity == null
        || quantity.getMeasureUnit() == null) ?
            0 : quantity.getMeasureUnit().hashCode());
    result = prime * result + ((recipe == null) ? 0 : recipe.hashCode());
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
    IngredientQuantity other = (IngredientQuantity) obj;
    if (!equalsIngredient(other))
      return false;
    if (optional == null) {
      if (other.optional != null)
        return false;
    } else if (!optional.equals(other.optional))
      return false;
    if (!equalsQuantity(other))
      return false;
    if (recipe == null) {
      if (other.recipe != null)
        return false;
    } else if (!recipe.equals(other.recipe))
      return false;
    return true;
  }

  private boolean equalsIngredient(IngredientQuantity other) {
    if (ingredient == null) {
      if (other.ingredient != null)
        return false;
    } else if (!ingredient.equals(other.ingredient))
      return false;
    return true;
  }

  private boolean equalsQuantity(IngredientQuantity other) {
    if (quantity == null || quantity.getMeasureUnit() == null) {
      if (other.quantity != null || other.quantity.getMeasureUnit() != null)
        return false;
    } else if (!quantity.getMeasureUnit().equals(other.quantity != null ?
        other.quantity.getMeasureUnit() : null))
      return false;
    return true;
  }

  @Override
  public String toString() {
    return "IngredientQuantity [id=" + id + ", recipe=" + recipe.getId()
        + ", ingredient=" + ingredient.getName()
        + ", " + quantity
        + ", optional=" + optional + "]";
  }

}
