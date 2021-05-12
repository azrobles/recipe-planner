package com.ara.recipeplanner.repository;

import com.ara.recipeplanner.model.Ingredient;

import org.springframework.data.jpa.repository.JpaRepository;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {

  Ingredient findOneByName(String name);

}
