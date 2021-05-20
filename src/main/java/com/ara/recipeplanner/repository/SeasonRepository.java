package com.ara.recipeplanner.repository;

import com.ara.recipeplanner.model.Season;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SeasonRepository extends JpaRepository<Season, Long> {

  Season findOneByName(String name);

}
