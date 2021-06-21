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
import com.ara.recipeplanner.model.Difficulty;
import com.ara.recipeplanner.model.Location;
import com.ara.recipeplanner.model.Recipe;
import com.ara.recipeplanner.model.RecipeType;
import com.ara.recipeplanner.model.Season;
import com.ara.recipeplanner.repository.RecipeRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RecipeServiceTest {

  @InjectMocks
  private RecipeService service;

  @Mock
  private RecipeRepository repository;
  @Mock
  private SupermarketService supermarketService;
  @Mock
  private LocationService locationService;
  @Mock
  private RecipeTypeService typeService;
  @Mock
  private SeasonService seasonService;
  @Mock
  private DifficultyService difficultyService;
  @Mock
  private IngredientQuantityService ingredientQuantityService;

  @Test
  void indexTest() {
    when(repository.findAll()).thenReturn(List.of(new Recipe()));

    List<Recipe> list = service.index();

    assertEquals(1, list.size());
    verify(repository, times(1)).findAll();
  }

  @Test
  void showTest() {
    Long id = 1L;
    Recipe recipe = new Recipe();
    recipe.setId(id);
    when(repository.findById(1L)).thenReturn(Optional.of(recipe));

    Recipe entity = service.show(id);

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
    Recipe entity = new Recipe();
    when(locationService.show(any())).thenReturn(new Location());
    when(typeService.show(any())).thenReturn(new RecipeType());
    when(seasonService.show(any())).thenReturn(new Season());
    when(difficultyService.show(any())).thenReturn(new Difficulty());

    when(repository.save(entity)).then(returnsFirstArg());

    Recipe saved = service.create(entity);

    assertNotNull(saved);
    verify(repository, times(1)).save(entity);
  }

  @Test
  void createEntityDuplicatedExceptionTest() {
    String name = "name";
    Recipe entity = new Recipe();
    entity.setName(name);

    Recipe saved = new Recipe();
    saved.setId(1L);
    saved.setName(name);
    when(repository.findOneByNameAndLocation(name, null)).thenReturn(saved);

    assertThrows(EntityDuplicatedException.class, () -> service.create(entity));
    verify(repository, times(0)).save(entity);
  }

  @Test
  void createEntityNotFoundExceptionTest() {
    Recipe entity = new Recipe();
    when(locationService.show(any()))
      .thenThrow(new EntityNotFoundException("", ""));

    assertThrows(EntityNotFoundException.class, () -> service.create(entity));
    verify(repository, times(0)).save(entity);
  }

  @Test
  void updateTest() {
    Long id = 1L;
    String name = "other";
    Recipe saved = new Recipe();
    saved.setId(id);
    saved.setName("name");
    when(repository.findById(id)).thenReturn(Optional.of(saved));
    when(locationService.show(any())).thenReturn(new Location());
    when(typeService.show(any())).thenReturn(new RecipeType());
    when(seasonService.show(any())).thenReturn(new Season());
    when(difficultyService.show(any())).thenReturn(new Difficulty());
    when(repository.save(any(Recipe.class))).then(returnsFirstArg());

    Recipe toSave = new Recipe();
    toSave.setId(id);
    toSave.setName(name);
    Recipe entity = service.update(toSave, id);

    assertNotNull(entity);
    assertEquals(id, entity.getId());
    assertEquals(name, entity.getName());
    verify(repository, times(1)).save(any(Recipe.class));
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
    Recipe entity = new Recipe();
    entity.setId(id);
    entity.setName(name);

    Recipe saved = new Recipe();
    saved.setId(id);
    saved.setName("name");
    when(repository.findById(id)).thenReturn(Optional.of(saved));

    Recipe duplicated = new Recipe();
    duplicated.setId(id + 1);
    duplicated.setName(name);
    when(repository.findOneByNameAndLocation(name, null))
      .thenReturn(duplicated);

    assertThrows(EntityDuplicatedException.class,()->service.update(entity,id));
    verify(repository, times(0)).save(any(Recipe.class));
  }

  @Test
  void updateEntityNotFoundExceptionTest() {
    Long id = 1L;
    Recipe entity = new Recipe();
    entity.setId(id);
    when(repository.findById(id)).thenReturn(Optional.of(new Recipe()));
    when(locationService.show(any()))
      .thenThrow(new EntityNotFoundException("", ""));

    assertThrows(EntityNotFoundException.class, ()->service.update(entity, id));
    verify(repository, times(0)).save(any(Recipe.class));
  }

  @Test
  void updateNewTest() {
    Long id = 1L;
    when(repository.findById(id)).thenReturn(Optional.empty());
    when(locationService.show(any())).thenReturn(new Location());
    when(typeService.show(any())).thenReturn(new RecipeType());
    when(seasonService.show(any())).thenReturn(new Season());
    when(difficultyService.show(any())).thenReturn(new Difficulty());
    when(repository.save(any(Recipe.class))).then(returnsFirstArg());

    Recipe entity = service.update(new Recipe(), id);

    assertNotNull(entity);
    assertEquals(id, entity.getId());
    verify(repository, times(1)).save(any(Recipe.class));
  }

  @Test
  void updateNewEntityDuplicatedExceptionTest() {
    Long id = 1L;
    String name = "other";
    Recipe entity = new Recipe();
    entity.setName(name);
    when(repository.findById(id)).thenReturn(Optional.empty());

    Recipe duplicated = new Recipe();
    duplicated.setId(id + 1);
    duplicated.setName(name);
    when(repository.findOneByNameAndLocation(name, null))
      .thenReturn(duplicated);

    assertThrows(EntityDuplicatedException.class,()->service.update(entity,id));
    verify(repository, times(0)).save(entity);
  }

  @Test
  void updateNewEntityNotFoundExceptionTest() {
    Long id = 1L;
    Recipe entity = new Recipe();
    entity.setId(id);
    when(repository.findById(id)).thenReturn(Optional.empty());
    when(locationService.show(any()))
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
