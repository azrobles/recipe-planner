package com.ara.recipeplanner.repository;

import com.ara.recipeplanner.model.Supermarket;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SupermarketRepository
    extends JpaRepository<Supermarket, Long> {

  Supermarket findOneByName(String name);

}
