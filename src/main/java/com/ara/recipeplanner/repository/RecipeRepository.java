package com.ara.recipeplanner.repository;

import com.ara.recipeplanner.model.Location;
import com.ara.recipeplanner.model.Recipe;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

  Recipe findOneByNameAndLocation(String name, Location location);

}
