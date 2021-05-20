package com.ara.recipeplanner.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.ara.recipeplanner.model.Season;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

@DataJpaTest
class SeasonRepositoryTest {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private SeasonRepository repository;

  @Test
  void findOneByNameTest() {
    String name = "name";
    Season entity = new Season(null, name);
    entityManager.persist(entity);
    entityManager.flush();

    Season found = repository.findOneByName(name);

    assertEquals(name, found.getName());
  }

}
