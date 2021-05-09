package com.ara.recipeplanner.repository;

import com.ara.recipeplanner.model.Availability;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AvailabilityRepository
    extends JpaRepository<Availability, Long> {

  Availability findOneByName(String name);

}
