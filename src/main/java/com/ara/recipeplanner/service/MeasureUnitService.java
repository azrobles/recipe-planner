package com.ara.recipeplanner.service;

import java.util.List;

import com.ara.recipeplanner.exception.EntityDuplicatedException;
import com.ara.recipeplanner.exception.EntityNotFoundException;
import com.ara.recipeplanner.model.MeasureUnit;
import com.ara.recipeplanner.repository.MeasureUnitRepository;

import org.springframework.stereotype.Service;

@Service
public class MeasureUnitService {

  private static final String ENTITY_NAME = "measure unit";

  private final MeasureUnitRepository repository;

  public MeasureUnitService(MeasureUnitRepository repository) {
    this.repository = repository;
  }

  public List<MeasureUnit> index() {
    return repository.findAll();
  }

  public MeasureUnit show(Long id) throws EntityNotFoundException {

    checkId(id);

    return repository.findById(id)
      .orElseThrow(() ->
        new EntityNotFoundException(ENTITY_NAME, Long.toString(id)));
  }

  public MeasureUnit create(MeasureUnit entity)
      throws EntityDuplicatedException {

    checkDuplicated(entity);

    return repository.save(entity);
  }

  public MeasureUnit update(MeasureUnit entity, Long id)
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

  private void checkDuplicated(MeasureUnit entity)
      throws EntityDuplicatedException {

    MeasureUnit another = repository.findOneByName(entity.getName());

    if (another != null && !another.getId().equals(entity.getId())) {
      throw new EntityDuplicatedException(ENTITY_NAME);
    }
  }

}
