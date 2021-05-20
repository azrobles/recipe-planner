package com.ara.recipeplanner.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.ara.recipeplanner.model.Season;

import org.junit.jupiter.api.Test;

class SeasonDtoMapperTest {

  @Test
  void toDtoTest() {
    Season model = new Season(1L, "name");

    SeasonDto dto = SeasonDtoMapper.toDto(model);

    assertEquals(model.getId(), dto.getId());
    assertEquals(model.getName(), dto.getName());
  }

  @Test
  void toModelTest() {
    SeasonDto dto = new SeasonDto();
    dto.setId(1L);
    dto.setName("name");

    Season model = SeasonDtoMapper.toModel(dto);

    assertEquals(dto.getId(), model.getId());
    assertEquals(dto.getName(), model.getName());
  }

}
