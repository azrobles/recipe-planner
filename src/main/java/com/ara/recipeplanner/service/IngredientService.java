package com.ara.recipeplanner.service;

import java.util.List;

import com.ara.recipeplanner.exception.EntityDuplicatedException;
import com.ara.recipeplanner.exception.EntityNotFoundException;
import com.ara.recipeplanner.model.Ingredient;
import com.ara.recipeplanner.repository.IngredientRepository;

import org.springframework.stereotype.Service;

@Service
public class IngredientService {

  private static final String ENTITY_NAME = "ingredient";

  private final IngredientRepository repository;
  private final AvailabilityService availabilityService;
  private final SupermarketService supermarketService;

  public IngredientService(IngredientRepository repository,
      AvailabilityService availabilityService,
      SupermarketService supermarketService) {

    this.repository = repository;
    this.availabilityService = availabilityService;
    this.supermarketService = supermarketService;
  }

  public List<Ingredient> index() {
    return repository.findAll();
  }

  public Ingredient show(Long id) throws EntityNotFoundException {

    checkId(id);

    return repository.findById(id)
      .orElseThrow(() ->
        new EntityNotFoundException(ENTITY_NAME, Long.toString(id)));
  }

  public Ingredient create(Ingredient entity)
      throws EntityDuplicatedException, EntityNotFoundException {

    checkDuplicated(entity);

    entity.setAvailability(availabilityService.show(
      entity.getAvailability()!=null ? entity.getAvailability().getId():null));
    entity.setSupermarket(supermarketService.show(
      entity.getSupermarket()!=null ? entity.getSupermarket().getId() : null));

    return repository.save(entity);
  }

  public Ingredient update(Ingredient entity, Long id)
      throws EntityNotFoundException, EntityDuplicatedException {

    checkId(id);

    return repository.findById(id)
      .map(e -> {

        e.setName(entity.getName());
        checkDuplicated(e);

        e.setAvailability(availabilityService.show(entity
          .getAvailability()!=null ? entity.getAvailability().getId() : null));
        e.setSupermarket(supermarketService.show(entity
          .getSupermarket() != null ? entity.getSupermarket().getId() : null));

        return repository.save(e);
      })
      .orElseGet(() -> {

        entity.setId(id);
        checkDuplicated(entity);

        entity.setAvailability(availabilityService.show(entity
          .getAvailability()!=null ? entity.getAvailability().getId() : null));
        entity.setSupermarket(supermarketService.show(entity
          .getSupermarket() != null ? entity.getSupermarket().getId() : null));

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

  private void checkDuplicated(Ingredient entity)
      throws EntityDuplicatedException {

    Ingredient another = repository.findOneByName(entity.getName());

    if (another != null && !another.getId().equals(entity.getId())) {
      throw new EntityDuplicatedException(ENTITY_NAME);
    }
  }

}
