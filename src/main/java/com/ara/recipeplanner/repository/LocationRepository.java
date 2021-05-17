package com.ara.recipeplanner.repository;

import com.ara.recipeplanner.model.Location;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<Location, Long> {

  Location findOneByName(String name);

}
