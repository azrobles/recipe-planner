package com.ara.recipeplanner.service;

import java.util.List;

import com.ara.recipeplanner.exception.EntityDuplicatedException;
import com.ara.recipeplanner.exception.EntityNotFoundException;
import com.ara.recipeplanner.model.RecipeType;
import com.ara.recipeplanner.repository.RecipeTypeRepository;

import org.springframework.stereotype.Service;

@Service
public class RecipeTypeService {

  private static final String ENTITY_NAME = "recipe type";

  private final RecipeTypeRepository repository;

  public RecipeTypeService(RecipeTypeRepository repository) {
    this.repository = repository;
  }

  public List<RecipeType> index() {
    return repository.findAll();
  }

  public RecipeType show(Long id) throws EntityNotFoundException {

    checkId(id);

    return repository.findById(id)
      .orElseThrow(() ->
        new EntityNotFoundException(ENTITY_NAME, Long.toString(id)));
  }

  public RecipeType create(RecipeType entity)
      throws EntityDuplicatedException {

    checkDuplicated(entity);

    return repository.save(entity);
  }

  public RecipeType update(RecipeType entity, Long id)
      throws EntityNotFoundException, EntityDuplicatedException {

    checkId(id);

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

  public void delete(Long id) throws EntityNotFoundException {

    checkId(id);

    repository.deleteById(id);
  }

  private void checkId(Long id) throws EntityNotFoundException {
    if (id == null) {
      throw new EntityNotFoundException(ENTITY_NAME, "without id");
    }
  }

  private void checkDuplicated(RecipeType entity)
      throws EntityDuplicatedException {

    RecipeType another = repository.findOneByName(entity.getName());

    if (another != null && !another.getId().equals(entity.getId())) {
      throw new EntityDuplicatedException(ENTITY_NAME);
    }
  }

}
