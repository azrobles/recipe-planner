package com.ara.recipeplanner.repository;

import com.ara.recipeplanner.model.TimeUnit;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeUnitRepository extends JpaRepository<TimeUnit, Long> {

  TimeUnit findOneByName(String name);

}
