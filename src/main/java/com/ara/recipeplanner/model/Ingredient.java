package com.ara.recipeplanner.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class Ingredient {

  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false, length = 50, unique = true)
  private String name;
  @ManyToOne(optional=false)
  private Availability availability;
  @ManyToOne(optional=false)
  private Supermarket supermarket;

  public Ingredient() {}

  public Ingredient(Long id, String name, Availability availability, Supermarket supermarket) {
    this.id = id;
    this.name = name;
    this.availability = availability;
    this.supermarket = supermarket;
  }

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

  public Availability getAvailability() {
    return availability;
  }

  public void setAvailability(Availability availability) {
    this.availability = availability;
  }

  public Supermarket getSupermarket() {
    return supermarket;
  }

  public void setSupermarket(Supermarket supermarket) {
    this.supermarket = supermarket;
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj)
      return true;
    if (obj == null)
      return false;
    if (getClass() != obj.getClass())
      return false;
    Ingredient other = (Ingredient) obj;
    if (name == null) {
      if (other.name != null)
        return false;
    } else if (!name.equals(other.name))
      return false;
    return true;
  }

  @Override
  public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + ((name == null) ? 0 : name.hashCode());
    return result;
  }

  @Override
  public String toString() {
    return "Ingredient [id=" + id + ", name=" + name + ", availability="
        + availability + ", supermarket=" + supermarket + "]";
  }

}
