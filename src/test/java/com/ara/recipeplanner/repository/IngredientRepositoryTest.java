package com.ara.recipeplanner.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.ara.recipeplanner.model.Availability;
import com.ara.recipeplanner.model.Ingredient;
import com.ara.recipeplanner.model.Supermarket;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

@DataJpaTest
class IngredientRepositoryTest {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private IngredientRepository repository;

  @Test
  void findOneByNameTest() {
    String name = "name";
    Availability availability = new Availability(null, name);
    Supermarket supermarket = new Supermarket(null, name);
    entityManager.persistAndFlush(availability);
    entityManager.persistAndFlush(supermarket);
    Ingredient entity = new Ingredient(null, name, availability, supermarket);
    entityManager.persist(entity);
    entityManager.flush();

    Ingredient found = repository.findOneByName(name);

    assertEquals(name, found.getName());
  }

}
