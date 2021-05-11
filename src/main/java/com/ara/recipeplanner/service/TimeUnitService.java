package com.ara.recipeplanner.service;

import java.util.List;

import com.ara.recipeplanner.exception.EntityDuplicatedException;
import com.ara.recipeplanner.exception.EntityNotFoundException;
import com.ara.recipeplanner.model.TimeUnit;
import com.ara.recipeplanner.repository.TimeUnitRepository;

import org.springframework.stereotype.Service;

@Service
public class TimeUnitService {

  private final TimeUnitRepository repository;

  public TimeUnitService(TimeUnitRepository repository) {
    this.repository = repository;
  }

  public List<TimeUnit> index() {
    return repository.findAll();
  }

  public TimeUnit show(Long id) throws EntityNotFoundException {

    return repository.findById(id)
      .orElseThrow(() ->
        new EntityNotFoundException("time unit", Long.toString(id)));
  }

  public TimeUnit create(TimeUnit entity)
      throws EntityDuplicatedException {

    checkDuplicated(entity);

    return repository.save(entity);
  }

  public TimeUnit update(TimeUnit entity, Long id)
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

  private void checkDuplicated(TimeUnit entity)
      throws EntityDuplicatedException {

    TimeUnit another = repository.findOneByName(entity.getName());

    if(another != null && !another.getId().equals(entity.getId())) {
      throw new EntityDuplicatedException("time unit");
    }
  }

}
