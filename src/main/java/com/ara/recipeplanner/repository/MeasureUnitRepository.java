package com.ara.recipeplanner.repository;

import com.ara.recipeplanner.model.MeasureUnit;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MeasureUnitRepository
    extends JpaRepository<MeasureUnit, Long> {

  MeasureUnit findOneByName(String name);

}
