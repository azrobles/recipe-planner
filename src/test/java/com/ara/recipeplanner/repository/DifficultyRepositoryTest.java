package com.ara.recipeplanner.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.ara.recipeplanner.model.Difficulty;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

@DataJpaTest
class DifficultyRepositoryTest {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private DifficultyRepository repository;

  @Test
  void findOneByNameTest() {
    String name = "name";
    Difficulty entity = new Difficulty(null, name);
    entityManager.persist(entity);
    entityManager.flush();

    Difficulty found = repository.findOneByName(name);

    assertEquals(name, found.getName());
  }

}
