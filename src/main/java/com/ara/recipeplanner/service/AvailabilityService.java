package com.ara.recipeplanner.service;

import java.util.List;

import com.ara.recipeplanner.exception.EntityDuplicatedException;
import com.ara.recipeplanner.exception.EntityNotFoundException;
import com.ara.recipeplanner.model.Availability;
import com.ara.recipeplanner.repository.AvailabilityRepository;

import org.springframework.stereotype.Service;

@Service
public class AvailabilityService {

  private static final String ENTITY_NAME = "availability";

  private final AvailabilityRepository repository;

  public AvailabilityService(AvailabilityRepository repository) {
    this.repository = repository;
  }

  public List<Availability> index() {
    return repository.findAll();
  }

  public Availability show(Long id) throws EntityNotFoundException {

    checkId(id);

    return repository.findById(id)
      .orElseThrow(() ->
        new EntityNotFoundException(ENTITY_NAME, Long.toString(id)));
  }

  public Availability create(Availability entity)
      throws EntityDuplicatedException {

    checkDuplicated(entity);

    return repository.save(entity);
  }

  public Availability update(Availability entity, Long id)
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

  private void checkDuplicated(Availability entity)
      throws EntityDuplicatedException {

    Availability another = repository.findOneByName(entity.getName());

    if (another != null && !another.getId().equals(entity.getId())) {
      throw new EntityDuplicatedException(ENTITY_NAME);
    }
  }

}
