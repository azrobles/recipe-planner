package com.ara.recipeplanner.service;

import java.util.List;

import com.ara.recipeplanner.exception.EntityDuplicatedException;
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

  public Supermarket create(Supermarket entity)
      throws EntityDuplicatedException {
    checkDuplicated(entity);
    return repository.save(entity);
  }

  public Supermarket update(Supermarket entity, Long id)
      throws EntityDuplicatedException {
    return repository.findById(id)
      .map(e -> {
        e.setName(entity.getName());
        checkDuplicated(e);
        return repository.save(e);
      })
      .orElseGet(() -> {
        entity.setId(id);
        checkDuplicated(entity);
        return repository.save(entity);
      });
  }

  public void delete(Long id) {
    repository.deleteById(id);
  }

  private void checkDuplicated(Supermarket entity)
      throws EntityDuplicatedException {
    Supermarket another = repository.findOneByName(entity.getName());
    if(another != null && !another.getId().equals(entity.getId())) {
      throw new EntityDuplicatedException("supermarket");
    }
  }

}
