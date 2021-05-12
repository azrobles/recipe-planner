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
import com.ara.recipeplanner.model.Ingredient;
import com.ara.recipeplanner.model.Supermarket;
import com.ara.recipeplanner.repository.IngredientRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class IngredientServiceTest {

  @InjectMocks
  private IngredientService service;

  @Mock
  private IngredientRepository repository;
  @Mock
  private AvailabilityService availabilityService;
  @Mock
  private SupermarketService supermarketService;

  @Test
  void indexTest() {
    when(repository.findAll()).thenReturn(List.of(new Ingredient()));

    List<Ingredient> list = service.index();

    assertEquals(1, list.size());
    verify(repository, times(1)).findAll();
  }

  @Test
  void showTest() {
    Long id = 1L;
    when(repository.findById(1L))
      .thenReturn(Optional.of(new Ingredient(id, "name", null, null)));

    Ingredient entity = service.show(id);

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
    Ingredient entity = new Ingredient();
    when(availabilityService.show(any())).thenReturn(new Availability());
    when(supermarketService.show(any())).thenReturn(new Supermarket());
    when(repository.save(entity)).then(returnsFirstArg());

    Ingredient saved = service.create(entity);

    assertNotNull(saved);
    verify(repository, times(1)).save(entity);
  }

  @Test
  void createEntityDuplicatedExceptionTest() {
    String name = "name";
    Ingredient entity = new Ingredient(null, name, null, null);
    when(repository.findOneByName(name))
      .thenReturn(new Ingredient(1L, name, null, null));

    assertThrows(EntityDuplicatedException.class, () -> service.create(entity));
    verify(repository, times(0)).save(entity);
  }

  @Test
  void createEntityNotFoundExceptionTest() {
    Ingredient entity = new Ingredient();
    when(availabilityService.show(any()))
      .thenThrow(new EntityNotFoundException("", ""));

    assertThrows(EntityNotFoundException.class, () -> service.create(entity));
    verify(repository, times(0)).save(entity);
  }

  @Test
  void updateTest() {
    Long id = 1L;
    String name = "other";
    when(repository.findById(id))
      .thenReturn(Optional.of(new Ingredient(id, "name", null, null)));
    when(availabilityService.show(any())).thenReturn(new Availability());
    when(supermarketService.show(any())).thenReturn(new Supermarket());
    when(repository.save(any(Ingredient.class))).then(returnsFirstArg());

    Ingredient entity = service.update(new Ingredient(id,name,null,null), id);

    assertNotNull(entity);
    assertEquals(id, entity.getId());
    assertEquals(name, entity.getName());
    verify(repository, times(1)).save(any(Ingredient.class));
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
    Ingredient entity = new Ingredient(id, name, null, null);
    when(repository.findById(id))
      .thenReturn(Optional.of(new Ingredient(id, "name", null, null)));
    when(repository.findOneByName(name))
      .thenReturn(new Ingredient(id + 1, name, null, null));

    assertThrows(EntityDuplicatedException.class,()->service.update(entity,id));
    verify(repository, times(0)).save(any(Ingredient.class));
  }

  @Test
  void updateEntityNotFoundExceptionTest() {
    Long id = 1L;
    String name = "other";
    Ingredient entity = new Ingredient(id, name, null, null);
    when(repository.findById(id))
      .thenReturn(Optional.of(new Ingredient(id, "name", null, null)));
    when(availabilityService.show(any()))
      .thenThrow(new EntityNotFoundException("", ""));

    assertThrows(EntityNotFoundException.class, ()->service.update(entity, id));
    verify(repository, times(0)).save(any(Ingredient.class));
  }

  @Test
  void updateNewTest() {
    Long id = 1L;
    when(repository.findById(id)).thenReturn(Optional.empty());
    when(availabilityService.show(any())).thenReturn(new Availability());
    when(supermarketService.show(any())).thenReturn(new Supermarket());
    when(repository.save(any(Ingredient.class))).then(returnsFirstArg());

    Ingredient entity = service.update(new Ingredient(), id);

    assertNotNull(entity);
    assertEquals(id, entity.getId());
    verify(repository, times(1)).save(any(Ingredient.class));
  }

  @Test
  void updateNewEntityDuplicatedExceptionTest() {
    Long id = 1L;
    String name = "other";
    Ingredient entity = new Ingredient(null, name, null, null);
    when(repository.findById(id)).thenReturn(Optional.empty());
    when(repository.findOneByName(name))
      .thenReturn(new Ingredient(id + 1, name, null, null));

    assertThrows(EntityDuplicatedException.class,()->service.update(entity,id));
    verify(repository, times(0)).save(entity);
  }

  @Test
  void updateNewEntityNotFoundExceptionTest() {
    Long id = 1L;
    String name = "other";
    Ingredient entity = new Ingredient(id, name, null, null);
    when(repository.findById(id)).thenReturn(Optional.empty());
    when(availabilityService.show(any()))
      .thenThrow(new EntityNotFoundException("", ""));

    assertThrows(EntityNotFoundException.class, ()->service.update(entity, id));
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
