package com.ara.recipeplanner.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.ara.recipeplanner.model.Difficulty;
import com.ara.recipeplanner.model.Location;
import com.ara.recipeplanner.model.Recipe;
import com.ara.recipeplanner.model.RecipeType;
import com.ara.recipeplanner.model.Season;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

@DataJpaTest
class RecipeRepositoryTest {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private RecipeRepository repository;

  @Test
  void findOneByNameAndLocationTest() {
    String name = "name";
    Location location = new Location(null, name);
    RecipeType type = new RecipeType(null, name);
    Season season = new Season(null, name);
    Difficulty difficulty = new Difficulty(null, name);
    Long frequency = 0L;
    entityManager.persistAndFlush(location);
    entityManager.persistAndFlush(type);
    entityManager.persistAndFlush(season);
    entityManager.persistAndFlush(difficulty);
    Recipe entity = new Recipe();
    entity.setName(name);
    entity.setLocation(location);
    entity.setType(type);
    entity.setSeason(season);
    entity.setDifficulty(difficulty);
    entity.setFrequency(frequency);
    entityManager.persist(entity);
    entityManager.flush();

    Recipe found = repository.findOneByNameAndLocation(name, location);

    assertEquals(name, found.getName());
    assertEquals(location, found.getLocation());
  }

}
