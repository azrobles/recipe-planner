package com.ara.recipeplanner.service;

import java.util.List;

import com.ara.recipeplanner.exception.EntityDuplicatedException;
import com.ara.recipeplanner.exception.EntityNotFoundException;
import com.ara.recipeplanner.model.Difficulty;
import com.ara.recipeplanner.model.Duration;
import com.ara.recipeplanner.model.Location;
import com.ara.recipeplanner.model.Recipe;
import com.ara.recipeplanner.model.RecipeType;
import com.ara.recipeplanner.model.Season;
import com.ara.recipeplanner.repository.RecipeRepository;

import org.springframework.stereotype.Service;

@Service
public class RecipeService {

  private static final String ENTITY_NAME = "recipe";

  private final RecipeRepository repository;
  private final LocationService locationService;
  private final RecipeTypeService typeService;
  private final SeasonService seasonService;
  private final DifficultyService difficultyService;
  private final TimeUnitService timeUnitService;
  private final IngredientQuantityService ingredientQuantityService;

  public RecipeService(RecipeRepository repository,
      LocationService locationService, RecipeTypeService typeService,
      SeasonService seasonService, DifficultyService difficultyService,
      TimeUnitService timeUnitService,
      IngredientQuantityService ingredientQuantityService) {

    this.repository = repository;
    this.locationService = locationService;
    this.typeService = typeService;
    this.seasonService = seasonService;
    this.difficultyService = difficultyService;
    this.timeUnitService = timeUnitService;
    this.ingredientQuantityService = ingredientQuantityService;
  }

  public List<Recipe> index() {
    return repository.findAll();
  }

  public Recipe show(Long id) throws EntityNotFoundException {

    checkId(id);

    return repository.findById(id)
      .orElseThrow(() ->
        new EntityNotFoundException(ENTITY_NAME, Long.toString(id)));
  }

  public Recipe create(Recipe entity)
      throws EntityDuplicatedException, EntityNotFoundException {

    entity.setLocation(getValidLocation(entity));

    checkDuplicated(entity);

    entity.setType(getValidType(entity));
    entity.setSeason(getValidSeason(entity));
    entity.setDifficulty(getValidDifficulty(entity));
    entity.setDuration(getValidDuration(entity));

    ingredientQuantityService.setValidIngredientQuantities(entity, null);

    return repository.save(entity);
  }

  public Recipe update(Recipe entity, Long id)
      throws EntityNotFoundException, EntityDuplicatedException {

    checkId(id);

    return repository.findById(id)
      .map(e -> {

        e.setName(entity.getName());
        e.setLocation(getValidLocation(entity));

        checkDuplicated(e);

        e.setType(getValidType(entity));
        e.setSeason(getValidSeason(entity));
        e.setDifficulty(getValidDifficulty(entity));
        e.setDuration(getValidDuration(entity));

        ingredientQuantityService.setValidIngredientQuantities(entity, e);

        return repository.save(e);
      })
      .orElseGet(() -> {

        entity.setId(id);
        entity.setLocation(getValidLocation(entity));

        checkDuplicated(entity);

        entity.setType(getValidType(entity));
        entity.setSeason(getValidSeason(entity));
        entity.setDifficulty(getValidDifficulty(entity));
        entity.setDuration(getValidDuration(entity));

        ingredientQuantityService.setValidIngredientQuantities(entity, null);

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

  private void checkDuplicated(Recipe entity) throws EntityDuplicatedException {

    Recipe another = repository.findOneByNameAndLocation(entity.getName(),
        entity.getLocation());

    if (another != null && !another.getId().equals(entity.getId())) {
      throw new EntityDuplicatedException(ENTITY_NAME);
    }
  }

  private Location getValidLocation(Recipe entity) {

    return locationService.show(
      entity.getLocation() != null ? entity.getLocation().getId() : null);
  }

  private RecipeType getValidType(Recipe entity) {

    return typeService.show(
      entity.getType() != null ? entity.getType().getId() : null);
  }

  private Season getValidSeason(Recipe entity) {

    return seasonService.show(
      entity.getSeason() != null ? entity.getSeason().getId() : null);
  }

  private Difficulty getValidDifficulty(Recipe entity) {

    return difficultyService.show(
      entity.getDifficulty() != null ? entity.getDifficulty().getId() : null);
  }

  private Duration getValidDuration(Recipe entity) {

    if (entity.getDuration() != null) {

      entity.getDuration().setTimeUnit(timeUnitService.show(
        entity.getDuration().getTimeUnit() != null ?
          entity.getDuration().getTimeUnit().getId() : null));
    }

    return entity.getDuration();
  }

}
