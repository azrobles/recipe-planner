package com.ara.recipeplanner.service;

import java.util.List;

import com.ara.recipeplanner.exception.EntityDuplicatedException;
import com.ara.recipeplanner.exception.EntityNotFoundException;
import com.ara.recipeplanner.model.TimeUnit;
import com.ara.recipeplanner.repository.TimeUnitRepository;

import org.springframework.stereotype.Service;

@Service
public class TimeUnitService {

  private static final String ENTITY_NAME = "time unit";

  private final TimeUnitRepository repository;

  public TimeUnitService(TimeUnitRepository repository) {
    this.repository = repository;
  }

  public List<TimeUnit> index() {
    return repository.findAll();
  }

  public TimeUnit show(Long id) throws EntityNotFoundException {

    checkId(id);

    return repository.findById(id)
      .orElseThrow(() ->
        new EntityNotFoundException(ENTITY_NAME, Long.toString(id)));
  }

  public TimeUnit create(TimeUnit entity)
      throws EntityDuplicatedException {

    checkDuplicated(entity);

    return repository.save(entity);
  }

  public TimeUnit update(TimeUnit entity, Long id)
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

  private void checkDuplicated(TimeUnit entity)
      throws EntityDuplicatedException {

    TimeUnit another = repository.findOneByName(entity.getName());

    if (another != null && !another.getId().equals(entity.getId())) {
      throw new EntityDuplicatedException(ENTITY_NAME);
    }
  }

}
