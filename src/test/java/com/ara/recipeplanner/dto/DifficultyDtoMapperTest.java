package com.ara.recipeplanner.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.ara.recipeplanner.model.Difficulty;

import org.junit.jupiter.api.Test;

class DifficultyDtoMapperTest {

  @Test
  void toDtoTest() {
    Difficulty model = new Difficulty(1L, "name");

    DifficultyDto dto = DifficultyDtoMapper.toDto(model);

    assertEquals(model.getId(), dto.getId());
    assertEquals(model.getName(), dto.getName());
  }

  @Test
  void toModelTest() {
    DifficultyDto dto = new DifficultyDto();
    dto.setId(1L);
    dto.setName("name");

    Difficulty model = DifficultyDtoMapper.toModel(dto);

    assertEquals(dto.getId(), model.getId());
    assertEquals(dto.getName(), model.getName());
  }

}
