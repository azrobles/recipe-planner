package com.ara.recipeplanner.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.ara.recipeplanner.model.Supermarket;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

@DataJpaTest
public class SupermarketRepositoryTest {

  @Autowired
  private TestEntityManager entityManager;

  @Autowired
  private SupermarketRepository repository;

  @Test
  public void findOneByNameTest() {
    String name = "name";
    Supermarket entity = new Supermarket(null, name);
    entityManager.persist(entity);
    entityManager.flush();

    Supermarket found = repository.findOneByName(name);

    assertEquals(name, found.getName());
  }

}
