package com.ara.recipeplanner.controller;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import com.ara.recipeplanner.exception.EntityDuplicatedException;
import com.ara.recipeplanner.exception.EntityNotFoundException;
import com.ara.recipeplanner.model.Availability;
import com.ara.recipeplanner.model.Difficulty;
import com.ara.recipeplanner.model.Ingredient;
import com.ara.recipeplanner.model.Location;
import com.ara.recipeplanner.model.Quantity;
import com.ara.recipeplanner.model.Recipe;
import com.ara.recipeplanner.model.RecipeType;
import com.ara.recipeplanner.model.Season;
import com.ara.recipeplanner.model.Supermarket;
import com.ara.recipeplanner.service.RecipeService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(RecipeController.class)
class RecipeControllerTest {

	private static final String BASE_URL = "/api/recipes";
  private static final String ENTITY_NAME = "recipe";

	private ObjectMapper mapper = new ObjectMapper();

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private RecipeService service;

	@Test
	void indexControllerTest() throws Exception {
		when(service.index()).thenReturn(List.of(new Recipe()));

		this.mockMvc.perform(get(BASE_URL)).andDo(print())
      .andExpect(status().isOk())
			.andExpect(jsonPath("$", hasSize(1)));

		verify(service, times(1)).index();
	}

	@Test
	void showControllerTest() throws Exception {
		Long id = 1L;
    Recipe recipe = new Recipe();
    recipe.setId(id);
		when(service.show(id)).thenReturn(recipe);

		this.mockMvc.perform(get(BASE_URL + "/{id}", id)).andDo(print())
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.id").value(id));

		verify(service, times(1)).show(id);
	}

	@Test
	void showControllerEntityNotFoundExceptionTest() throws Exception {
		Long id = 1L;
		when(service.show(id))
			.thenThrow(new EntityNotFoundException(ENTITY_NAME, Long.toString(id)));

		this.mockMvc.perform(get(BASE_URL + "/{id}", id)).andDo(print())
			.andExpect(status().isNotFound())
			.andExpect(jsonPath("$", is("Could not find " + ENTITY_NAME + " " + id)));

		verify(service, times(1)).show(id);
	}

	@Test
	void createControllerTest() throws Exception {
		Long id = 1L;
		String name = "name";
    Recipe entity = new Recipe();
    entity.setId(id);
    entity.setName(name);
    entity.setLocation(new Location(id, name));
    entity.setType(new RecipeType(id, name));
    entity.setSeason(new Season(id, name));
    entity.setDifficulty(new Difficulty(id, name));
    entity.setFrequency(id);
    entity.addIngredient(new Ingredient(id, name, new Availability(id, name),
        new Supermarket(id, name)), new Quantity(), false);
		when(service.create(entity)).thenReturn(entity);

		this.mockMvc.perform(post(BASE_URL)
			.contentType(MediaType.APPLICATION_JSON)
			.content(mapper.writeValueAsString(entity))).andDo(print())
			.andExpect(status().isOk())
			.andExpect(jsonPath("$").isNotEmpty())
			.andExpect(jsonPath("$.id").value(id))
			.andExpect(jsonPath("$.name").value(name))
      .andExpect(jsonPath("$.location.name").value(name))
      .andExpect(jsonPath("$.type.name").value(name))
      .andExpect(jsonPath("$.season.name").value(name))
      .andExpect(jsonPath("$.difficulty.name").value(name))
      .andExpect(jsonPath("$.frequency").value(id))
      .andExpect(jsonPath("$.ingredients", hasSize(1)))
      .andExpect(jsonPath("$.ingredients[0].ingredient.name").value(name));

		verify(service, times(1)).create(entity);
	}

  @Test
	void createControllerEntityDuplicatedExceptionTest() throws Exception {
		Long id = 1L;
		String name = "name";
    Recipe entity = new Recipe();
    entity.setId(id);
    entity.setName(name);
    entity.setLocation(new Location(id, name));
    entity.setType(new RecipeType(id, name));
    entity.setSeason(new Season(id, name));
    entity.setDifficulty(new Difficulty(id, name));
    entity.setFrequency(id);
		when(service.create(entity))
			.thenThrow(new EntityDuplicatedException(ENTITY_NAME));

		this.mockMvc.perform(post(BASE_URL)
      .contentType(MediaType.APPLICATION_JSON)
      .content(mapper.writeValueAsString(entity))).andDo(print())
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$", is(
        "Another " + ENTITY_NAME + " with the same identifying data exists")));

		verify(service, times(1)).create(entity);
	}

  @Test
	void createControllerEntityNotFoundExceptionTest() throws Exception {
		Long id = 1L;
		String name = "name";
    Recipe entity = new Recipe();
    entity.setId(id);
    entity.setName(name);
    entity.setLocation(new Location(id, name));
    entity.setType(new RecipeType(id, name));
    entity.setSeason(new Season(id, name));
    entity.setDifficulty(new Difficulty(id, name));
    entity.setFrequency(id);
		when(service.create(entity))
			.thenThrow(new EntityNotFoundException(ENTITY_NAME, Long.toString(id)));

		this.mockMvc.perform(post(BASE_URL)
      .contentType(MediaType.APPLICATION_JSON)
      .content(mapper.writeValueAsString(entity))).andDo(print())
			.andExpect(status().isNotFound())
			.andExpect(jsonPath("$", is("Could not find " + ENTITY_NAME + " " + id)));

		verify(service, times(1)).create(entity);
	}

  @Test
	void createControllerMethodArgumentNotValidExceptionTest() throws Exception {
		Long id = 1L;
		String name = "name";
    Recipe entity = new Recipe();
    entity.setId(id);
    entity.setName(null);
    entity.setLocation(new Location(id, name));
    entity.setType(new RecipeType(id, name));
    entity.setSeason(new Season(id, name));
    entity.setDifficulty(new Difficulty(id, name));
    entity.setFrequency(id);

		this.mockMvc.perform(post(BASE_URL)
      .contentType(MediaType.APPLICATION_JSON)
      .content(mapper.writeValueAsString(entity))).andDo(print())
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$", containsString("name must not be blank;")));

		verify(service, times(0)).create(entity);
	}

	@Test
	void updateControllerTest() throws Exception {
		Long id = 1L;
		String name = "name";
    Recipe entity = new Recipe();
    entity.setId(id);
    entity.setName(name);
    entity.setLocation(new Location(id, name));
    entity.setType(new RecipeType(id, name));
    entity.setSeason(new Season(id, name));
    entity.setDifficulty(new Difficulty(id, name));
    entity.setFrequency(id);
		when(service.update(entity, id)).thenReturn(entity);

		this.mockMvc.perform(put(BASE_URL + "/{id}", id)
			.contentType(MediaType.APPLICATION_JSON)
			.content(mapper.writeValueAsString(entity))).andDo(print())
			.andExpect(status().isOk())
			.andExpect(jsonPath("$").isNotEmpty())
			.andExpect(jsonPath("$.id").value(id))
			.andExpect(jsonPath("$.name").value(name))
      .andExpect(jsonPath("$.location.name").value(name))
      .andExpect(jsonPath("$.type.name").value(name))
      .andExpect(jsonPath("$.season.name").value(name))
      .andExpect(jsonPath("$.difficulty.name").value(name))
      .andExpect(jsonPath("$.frequency").value(id));

		verify(service, times(1)).update(entity, id);
	}

  @Test
	void updateControllerEntityNotFoundExceptionTest() throws Exception {
		Long id = 1L;
		String name = "name";
    Recipe entity = new Recipe();
    entity.setId(id);
    entity.setName(name);
    entity.setLocation(new Location(id, name));
    entity.setType(new RecipeType(id, name));
    entity.setSeason(new Season(id, name));
    entity.setDifficulty(new Difficulty(id, name));
    entity.setFrequency(id);
		when(service.update(entity, id))
			.thenThrow(new EntityNotFoundException(ENTITY_NAME, Long.toString(id)));

		this.mockMvc.perform(put(BASE_URL + "/{id}", id)
      .contentType(MediaType.APPLICATION_JSON)
      .content(mapper.writeValueAsString(entity))).andDo(print())
			.andExpect(status().isNotFound())
			.andExpect(jsonPath("$", is("Could not find " + ENTITY_NAME + " " + id)));

		verify(service, times(1)).update(entity, id);
	}

  @Test
	void updateControllerEntityDuplicatedExceptionTest() throws Exception {
		Long id = 1L;
		String name = "name";
    Recipe entity = new Recipe();
    entity.setId(id);
    entity.setName(name);
    entity.setLocation(new Location(id, name));
    entity.setType(new RecipeType(id, name));
    entity.setSeason(new Season(id, name));
    entity.setDifficulty(new Difficulty(id, name));
    entity.setFrequency(id);
		when(service.update(entity, id))
			.thenThrow(new EntityDuplicatedException(ENTITY_NAME));

		this.mockMvc.perform(put(BASE_URL + "/{id}", id)
      .contentType(MediaType.APPLICATION_JSON)
      .content(mapper.writeValueAsString(entity))).andDo(print())
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$", is(
        "Another " + ENTITY_NAME + " with the same identifying data exists")));

		verify(service, times(1)).update(entity, id);
	}

  @Test
	void updateControllerMethodArgumentNotValidExceptionTest() throws Exception {
    Long id = 1L;
		String name = "name";
    Recipe entity = new Recipe();
    entity.setId(id);
    entity.setName(null);
    entity.setLocation(new Location(id, name));
    entity.setType(new RecipeType(id, name));
    entity.setSeason(new Season(id, name));
    entity.setDifficulty(new Difficulty(id, name));
    entity.setFrequency(id);

		this.mockMvc.perform(put(BASE_URL + "/{id}", id)
      .contentType(MediaType.APPLICATION_JSON)
      .content(mapper.writeValueAsString(entity))).andDo(print())
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$", containsString("name must not be blank;")));

    verify(service, times(0)).update(entity, id);
	}

	@Test
	void deleteControllerTest() throws Exception {
		Long id = 1L;
    doNothing().when(service).delete(id);

		this.mockMvc.perform(delete(BASE_URL + "/{id}", id)).andDo(print())
			.andExpect(status().isOk())
			.andExpect(jsonPath("$").doesNotExist());

		verify(service, times(1)).delete(id);
	}

  @Test
	void deleteControllerEntityNotFoundExceptionTest() throws Exception {
		Long id = 1L;
    doThrow(new EntityNotFoundException(ENTITY_NAME, Long.toString(id)))
      .when(service).delete(id);;

    this.mockMvc.perform(delete(BASE_URL + "/{id}", id)).andDo(print())
			.andExpect(status().isNotFound())
			.andExpect(jsonPath("$", is("Could not find " + ENTITY_NAME + " " + id)));

		verify(service, times(1)).delete(id);
	}

}
