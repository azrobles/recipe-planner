package com.ara.recipeplanner.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.ara.recipeplanner.model.TimeUnit;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

@DataJpaTest
class TimeUnitRepositoryTest {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private TimeUnitRepository repository;

  @Test
  void findOneByNameTest() {
    String name = "name";
    TimeUnit entity = new TimeUnit(null, name);
    entityManager.persist(entity);
    entityManager.flush();

    TimeUnit found = repository.findOneByName(name);

    assertEquals(name, found.getName());
  }

}
