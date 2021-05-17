package com.ara.recipeplanner.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.ara.recipeplanner.model.Location;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

@DataJpaTest
class LocationRepositoryTest {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private LocationRepository repository;

  @Test
  void findOneByNameTest() {
    String name = "name";
    Location entity = new Location(null, name);
    entityManager.persist(entity);
    entityManager.flush();

    Location found = repository.findOneByName(name);

    assertEquals(name, found.getName());
  }

}
