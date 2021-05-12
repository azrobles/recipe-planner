package com.ara.recipeplanner.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import com.ara.recipeplanner.exception.EntityDuplicatedException;
import com.ara.recipeplanner.exception.EntityNotFoundException;
import com.ara.recipeplanner.model.MeasureUnit;
import com.ara.recipeplanner.repository.MeasureUnitRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class MeasureUnitServiceTest {

  @InjectMocks
  private MeasureUnitService service;

  @Mock
  private MeasureUnitRepository repository;

  @Test
  void indexTest() {
    when(repository.findAll()).thenReturn(List.of(new MeasureUnit()));

    List<MeasureUnit> list = service.index();

    assertEquals(1, list.size());
    verify(repository, times(1)).findAll();
  }

  @Test
  void showTest() {
    Long id = 1L;
    when(repository.findById(1L))
      .thenReturn(Optional.of(new MeasureUnit(id, "name")));

    MeasureUnit entity = service.show(id);

    assertNotNull(entity);
    assertEquals(id, entity.getId());
    verify(repository, times(1)).findById(id);
  }

  @Test
  void showEntityNotFoundExceptionTest() {
    Long id = 1L;
    when(repository.findById(id)).thenReturn(Optional.empty());

    assertThrows(EntityNotFoundException.class, () -> service.show(id));
    verify(repository, times(1)).findById(id);
  }

  @Test
  void createTest() {
    MeasureUnit entity = new MeasureUnit();
    when(repository.save(entity)).then(returnsFirstArg());

    MeasureUnit saved = service.create(entity);

    assertNotNull(saved);
    verify(repository, times(1)).save(entity);
  }

  @Test
  void createEntityDuplicatedExceptionTest() {
    String name = "name";
    when(repository.findOneByName(name)).thenReturn(new MeasureUnit(1L, name));
    MeasureUnit entity = new MeasureUnit(null, name);

    assertThrows(EntityDuplicatedException.class, () -> service.create(entity));
    verify(repository, times(0)).save(entity);
  }

  @Test
  void updateTest() {
    Long id = 1L;
    String name = "other";
    when(repository.findById(id))
      .thenReturn(Optional.of(new MeasureUnit(id, "name")));
    when(repository.save(any(MeasureUnit.class))).then(returnsFirstArg());

    MeasureUnit entity = service.update(new MeasureUnit(id, name), id);

    assertNotNull(entity);
    assertEquals(id, entity.getId());
    assertEquals(name, entity.getName());
    verify(repository, times(1)).save(any(MeasureUnit.class));
  }

  @Test
  void updateEntityDuplicatedExceptionTest() {
    Long id = 1L;
    String name = "other";
    when(repository.findOneByName(name))
      .thenReturn(new MeasureUnit(id + 1, name));
    when(repository.findById(id))
      .thenReturn(Optional.of(new MeasureUnit(id, "name")));
    MeasureUnit entity = new MeasureUnit(id, name);

    assertThrows(EntityDuplicatedException.class,()->service.update(entity,id));
    verify(repository, times(0)).save(any(MeasureUnit.class));
  }

  @Test
  void updateNewTest() {
    Long id = 1L;
    when(repository.findById(id)).thenReturn(Optional.empty());
    when(repository.save(any(MeasureUnit.class))).then(returnsFirstArg());

    MeasureUnit entity = service.update(new MeasureUnit(), id);

    assertNotNull(entity);
    assertEquals(id, entity.getId());
    verify(repository, times(1)).save(any(MeasureUnit.class));
  }

  @Test
  void updateNewEntityDuplicatedExceptionTest() {
    Long id = 1L;
    String name = "other";
    when(repository.findOneByName(name))
      .thenReturn(new MeasureUnit(id + 1, name));
    when(repository.findById(id)).thenReturn(Optional.empty());
    MeasureUnit entity = new MeasureUnit(null, name);

    assertThrows(EntityDuplicatedException.class,()->service.update(entity,id));
    verify(repository, times(0)).save(entity);
  }

  @Test
  void deleteTest() {
    Long id = 1L;
    doNothing().when(repository).deleteById(id);

    service.delete(id);

    verify(repository, times(1)).deleteById(id);
  }

}