package com.ara.recipeplanner.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.ara.recipeplanner.model.Availability;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

@DataJpaTest
public class AvailabilityRepositoryTest {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private AvailabilityRepository repository;

  @Test
  public void findOneByNameTest() {
    String name = "name";
    Availability entity = new Availability(null, name);
    entityManager.persist(entity);
    entityManager.flush();

    Availability found = repository.findOneByName(name);

    assertEquals(name, found.getName());
  }

}
