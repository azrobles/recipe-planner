package com.ara.recipeplanner.repository;

import com.ara.recipeplanner.model.RecipeType;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipeTypeRepository extends JpaRepository<RecipeType, Long> {

  RecipeType findOneByName(String name);

}
