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
import com.ara.recipeplanner.model.Availability;
import com.ara.recipeplanner.repository.AvailabilityRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AvailabilityServiceTest {

  @InjectMocks
  private AvailabilityService service;

  @Mock
  private AvailabilityRepository repository;

  @Test
  void indexTest() {
    when(repository.findAll()).thenReturn(List.of(new Availability()));

    List<Availability> list = service.index();

    assertEquals(1, list.size());
    verify(repository, times(1)).findAll();
  }

  @Test
  void showTest() {
    Long id = 1L;
    when(repository.findById(1L))
      .thenReturn(Optional.of(new Availability(id, "name")));

    Availability entity = service.show(id);

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
    Availability entity = new Availability();
    when(repository.save(entity)).then(returnsFirstArg());

    Availability saved = service.create(entity);

    assertNotNull(saved);
    verify(repository, times(1)).save(entity);
  }

  @Test
  void createEntityDuplicatedExceptionTest() {
    String name = "name";
    when(repository.findOneByName(name)).thenReturn(new Availability(1L, name));
    Availability entity = new Availability(null, name);

    assertThrows(EntityDuplicatedException.class, () -> service.create(entity));
    verify(repository, times(0)).save(entity);
  }

  @Test
  void updateTest() {
    Long id = 1L;
    String name = "other";
    when(repository.findById(id))
      .thenReturn(Optional.of(new Availability(id, "name")));
    when(repository.save(any(Availability.class))).then(returnsFirstArg());

    Availability entity = service.update(new Availability(id, name), id);

    assertNotNull(entity);
    assertEquals(id, entity.getId());
    assertEquals(name, entity.getName());
    verify(repository, times(1)).save(any(Availability.class));
  }

  @Test
  void updateEntityDuplicatedExceptionTest() {
    Long id = 1L;
    String name = "other";
    when(repository.findOneByName(name))
      .thenReturn(new Availability(id + 1, name));
    when(repository.findById(id))
      .thenReturn(Optional.of(new Availability(id, "name")));
    Availability entity = new Availability(id, name);

    assertThrows(EntityDuplicatedException.class,()->service.update(entity,id));
    verify(repository, times(0)).save(any(Availability.class));
  }

  @Test
  void updateNewTest() {
    Long id = 1L;
    when(repository.findById(id)).thenReturn(Optional.empty());
    when(repository.save(any(Availability.class))).then(returnsFirstArg());

    Availability entity = service.update(new Availability(), id);

    assertNotNull(entity);
    assertEquals(id, entity.getId());
    verify(repository, times(1)).save(any(Availability.class));
  }

  @Test
  void updateNewEntityDuplicatedExceptionTest() {
    Long id = 1L;
    String name = "other";
    when(repository.findOneByName(name))
      .thenReturn(new Availability(id + 1, name));
    when(repository.findById(id)).thenReturn(Optional.empty());
    Availability entity = new Availability(null, name);

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
