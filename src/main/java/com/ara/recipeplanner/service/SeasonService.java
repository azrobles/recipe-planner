package com.ara.recipeplanner.service;

import java.util.List;

import com.ara.recipeplanner.exception.EntityDuplicatedException;
import com.ara.recipeplanner.exception.EntityNotFoundException;
import com.ara.recipeplanner.model.Season;
import com.ara.recipeplanner.repository.SeasonRepository;

import org.springframework.stereotype.Service;

@Service
public class SeasonService {

  private static final String ENTITY_NAME = "season";

  private final SeasonRepository repository;

  public SeasonService(SeasonRepository repository) {
    this.repository = repository;
  }

  public List<Season> index() {
    return repository.findAll();
  }

  public Season show(Long id) throws EntityNotFoundException {

    checkId(id);

    return repository.findById(id)
      .orElseThrow(() ->
        new EntityNotFoundException(ENTITY_NAME, Long.toString(id)));
  }

  public Season create(Season entity)
      throws EntityDuplicatedException {

    checkDuplicated(entity);

    return repository.save(entity);
  }

  public Season update(Season entity, Long id)
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

  private void checkDuplicated(Season entity)
      throws EntityDuplicatedException {

    Season another = repository.findOneByName(entity.getName());

    if (another != null && !another.getId().equals(entity.getId())) {
      throw new EntityDuplicatedException(ENTITY_NAME);
    }
  }

}
