package com.ara.recipeplanner.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.ara.recipeplanner.model.MeasureUnit;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

@DataJpaTest
class MeasureUnitRepositoryTest {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private MeasureUnitRepository repository;

  @Test
  void findOneByNameTest() {
    String name = "name";
    MeasureUnit entity = new MeasureUnit(null, name);
    entityManager.persist(entity);
    entityManager.flush();

    MeasureUnit found = repository.findOneByName(name);

    assertEquals(name, found.getName());
  }

}
