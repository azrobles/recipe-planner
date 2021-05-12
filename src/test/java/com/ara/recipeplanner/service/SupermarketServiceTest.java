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
import com.ara.recipeplanner.model.Supermarket;
import com.ara.recipeplanner.repository.SupermarketRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class SupermarketServiceTest {

  @InjectMocks
  private SupermarketService service;

  @Mock
  private SupermarketRepository repository;

  @Test
  void indexTest() {
    when(repository.findAll()).thenReturn(List.of(new Supermarket()));

    List<Supermarket> list = service.index();

    assertEquals(1, list.size());
    verify(repository, times(1)).findAll();
  }

  @Test
  void showTest() {
    Long id = 1L;
    when(repository.findById(1L))
      .thenReturn(Optional.of(new Supermarket(id, "name")));

    Supermarket entity = service.show(id);

    assertNotNull(entity);
    assertEquals(id, entity.getId());
    verify(repository, times(1)).findById(id);
  }

  @Test
  void showNullIdEntityNotFoundExceptionTest() {
    assertThrows(EntityNotFoundException.class, () -> service.show(null));
    verify(repository, times(0)).findById(any());
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
    Supermarket entity = new Supermarket();
    when(repository.save(entity)).then(returnsFirstArg());

    Supermarket saved = service.create(entity);

    assertNotNull(saved);
    verify(repository, times(1)).save(entity);
  }

  @Test
  void createEntityDuplicatedExceptionTest() {
    String name = "name";
    Supermarket entity = new Supermarket(null, name);
    when(repository.findOneByName(name)).thenReturn(new Supermarket(1L, name));

    assertThrows(EntityDuplicatedException.class, () -> service.create(entity));
    verify(repository, times(0)).save(entity);
  }

  @Test
  void updateTest() {
    Long id = 1L;
    String name = "other";
    when(repository.findById(id))
      .thenReturn(Optional.of(new Supermarket(id, "name")));
    when(repository.save(any(Supermarket.class))).then(returnsFirstArg());

    Supermarket entity = service.update(new Supermarket(id, name), id);

    assertNotNull(entity);
    assertEquals(id, entity.getId());
    assertEquals(name, entity.getName());
    verify(repository, times(1)).save(any(Supermarket.class));
  }

  @Test
  void updateNullIdEntityNotFoundExceptionTest() {
    assertThrows(EntityNotFoundException.class, ()->service.update(null, null));
    verify(repository, times(0)).save(any());
  }

  @Test
  void updateEntityDuplicatedExceptionTest() {
    Long id = 1L;
    String name = "other";
    Supermarket entity = new Supermarket(id, name);
    when(repository.findById(id))
      .thenReturn(Optional.of(new Supermarket(id, "name")));
    when(repository.findOneByName(name)).thenReturn(new Supermarket(id+1,name));

    assertThrows(EntityDuplicatedException.class,()->service.update(entity,id));
    verify(repository, times(0)).save(any(Supermarket.class));
  }

  @Test
  void updateNewTest() {
    Long id = 1L;
    when(repository.findById(id)).thenReturn(Optional.empty());
    when(repository.save(any(Supermarket.class))).then(returnsFirstArg());

    Supermarket entity = service.update(new Supermarket(), id);

    assertNotNull(entity);
    assertEquals(id, entity.getId());
    verify(repository, times(1)).save(any(Supermarket.class));
  }

  @Test
  void updateNewEntityDuplicatedExceptionTest() {
    Long id = 1L;
    String name = "other";
    Supermarket entity = new Supermarket(null, name);
    when(repository.findById(id)).thenReturn(Optional.empty());
    when(repository.findOneByName(name)).thenReturn(new Supermarket(id+1,name));

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

  @Test
  void deleteNullIdEntityNotFoundExceptionTest() {
    assertThrows(EntityNotFoundException.class, () -> service.delete(null));
    verify(repository, times(0)).deleteById(any());
  }

}
