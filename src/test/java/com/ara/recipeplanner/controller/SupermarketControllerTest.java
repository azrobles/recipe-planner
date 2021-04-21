package com.ara.recipeplanner.controller;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.doNothing;
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

import com.ara.recipeplanner.exception.EntityNotFoundException;
import com.ara.recipeplanner.model.Supermarket;
import com.ara.recipeplanner.service.SupermarketService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(SupermarketController.class)
class SupermarketControllerTest {

	private static final String BASE_URL = "/api/supermarkets";

	private ObjectMapper mapper = new ObjectMapper();

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private SupermarketService service;

	@Test
	void indexControllerTest() throws Exception {
		when(service.index()).thenReturn(List.of(new Supermarket()));

		this.mockMvc.perform(get(BASE_URL)).andDo(print())
      .andExpect(status().isOk())
			.andExpect(jsonPath("$", hasSize(1)));

		verify(service, times(1)).index();
	}

	@Test
	void showControllerTest() throws Exception {
		Long id = 1L;
		when(service.show(id)).thenReturn(new Supermarket(id, "name"));

		this.mockMvc.perform(get(BASE_URL + "/{id}", id)).andDo(print())
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.id").value(id));

		verify(service, times(1)).show(id);
	}

	@Test
	void showControllerEntityNotFoundExceptionTest() throws Exception {
		Long id = 1L;
		String entity = "supermarket";
		when(service.show(id))
			.thenThrow(new EntityNotFoundException("supermarket", Long.toString(id)));

		this.mockMvc.perform(get(BASE_URL + "/{id}", id)).andDo(print())
			.andExpect(status().isNotFound())
			.andExpect(jsonPath("$", is("Could not find " + entity + " " + id)));

		verify(service, times(1)).show(id);
	}

	@Test
	void createControllerTest() throws Exception {
		Long id = 1L;
		String name = "name";
		Supermarket entity = new Supermarket(id, name);
		when(service.create(entity)).thenReturn(entity);

		this.mockMvc.perform(post(BASE_URL)
			.contentType(MediaType.APPLICATION_JSON)
			.content(mapper.writeValueAsString(entity))).andDo(print())
			.andExpect(status().isOk())
			.andExpect(jsonPath("$").isNotEmpty())
			.andExpect(jsonPath("$.id").value(id))
			.andExpect(jsonPath("$.name").value(name));

		verify(service, times(1)).create(entity);
	}

	@Test
	void updateControllerTest() throws Exception {
		Long id = 1L;
		String name = "name";
		Supermarket entity = new Supermarket(id, name);
		when(service.update(entity, id)).thenReturn(entity);

		this.mockMvc.perform(put(BASE_URL + "/{id}", id)
			.contentType(MediaType.APPLICATION_JSON)
			.content(mapper.writeValueAsString(entity))).andDo(print())
			.andExpect(status().isOk())
			.andExpect(jsonPath("$").isNotEmpty())
			.andExpect(jsonPath("$.id").value(id))
			.andExpect(jsonPath("$.name").value(name));

		verify(service, times(1)).update(entity, id);
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

}
