package com.ara.recipeplanner.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.ara.recipeplanner.model.RecipeType;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

@DataJpaTest
class RecipeTypeRepositoryTest {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private RecipeTypeRepository repository;

  @Test
  void findOneByNameTest() {
    String name = "name";
    RecipeType entity = new RecipeType(null, name);
    entityManager.persist(entity);
    entityManager.flush();

    RecipeType found = repository.findOneByName(name);

    assertEquals(name, found.getName());
  }

}
