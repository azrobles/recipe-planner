package com.ara.recipeplanner.service;

import java.util.List;

import com.ara.recipeplanner.exception.EntityNotFoundException;
import com.ara.recipeplanner.model.Supermarket;
import com.ara.recipeplanner.repository.SupermarketRepository;

import org.springframework.stereotype.Service;

@Service
public class SupermarketService {
  
  private final SupermarketRepository repository;

  public SupermarketService(SupermarketRepository repository) {
    this.repository = repository;
  }

  public List<Supermarket> index() {
    return repository.findAll();
  }

  public Supermarket show(Long id) throws EntityNotFoundException {
    return repository.findById(id)
      .orElseThrow(() -> 
        new EntityNotFoundException("supermarket", Long.toString(id)));
  }

  public Supermarket create(Supermarket entity) {
    return repository.save(entity);
  }

  public Supermarket update(Supermarket entity, Long id) {
    return repository.findById(id)
      .map(e -> {
        e.setName(entity.getName());
        return repository.save(e);
      })
      .orElseGet(() -> {
        entity.setId(id);
        return repository.save(entity);
      });
  }

  public void delete(Long id) {
    repository.deleteById(id);
  }

}
