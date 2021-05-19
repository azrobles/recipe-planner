package com.ara.recipeplanner.repository;

import com.ara.recipeplanner.model.Difficulty;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DifficultyRepository extends JpaRepository<Difficulty, Long> {

  Difficulty findOneByName(String name);

}
