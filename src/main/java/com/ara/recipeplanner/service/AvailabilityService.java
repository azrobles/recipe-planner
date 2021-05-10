package com.ara.recipeplanner.service;

import java.util.List;

import com.ara.recipeplanner.exception.EntityDuplicatedException;
import com.ara.recipeplanner.exception.EntityNotFoundException;
import com.ara.recipeplanner.model.Availability;
import com.ara.recipeplanner.repository.AvailabilityRepository;

import org.springframework.stereotype.Service;

@Service
public class AvailabilityService {

  private final AvailabilityRepository repository;

  public AvailabilityService(AvailabilityRepository repository) {
    this.repository = repository;
  }

  public List<Availability> index() {
    return repository.findAll();
  }

  public Availability show(Long id) throws EntityNotFoundException {

    return repository.findById(id)
      .orElseThrow(() ->
        new EntityNotFoundException("availability", Long.toString(id)));
  }

  public Availability create(Availability entity)
      throws EntityDuplicatedException {

    checkDuplicated(entity);

    return repository.save(entity);
  }

  public Availability update(Availability entity, Long id)
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

  private void checkDuplicated(Availability entity)
      throws EntityDuplicatedException {

    Availability another = repository.findOneByName(entity.getName());

    if(another != null && !another.getId().equals(entity.getId())) {
      throw new EntityDuplicatedException("availability");
    }
  }

}
