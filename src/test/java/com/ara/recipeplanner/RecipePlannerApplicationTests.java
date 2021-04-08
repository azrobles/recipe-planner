package com.ara.recipeplanner;

import static org.assertj.core.api.Assertions.assertThat;

import com.ara.recipeplanner.controller.SupermarketController;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class RecipePlannerApplicationTests {

	@Autowired
	private SupermarketController supermarketController;

	@Test
	void contextLoads() {
		assertThat(supermarketController).isNotNull();
	}

}
