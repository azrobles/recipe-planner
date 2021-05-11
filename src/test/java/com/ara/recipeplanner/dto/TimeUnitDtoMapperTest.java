package com.ara.recipeplanner.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.ara.recipeplanner.model.TimeUnit;

import org.junit.jupiter.api.Test;

class TimeUnitDtoMapperTest {

  @Test
  void toDtoTest() {
    TimeUnit model = new TimeUnit(1L, "name");

    TimeUnitDto dto = TimeUnitDtoMapper.toDto(model);

    assertEquals(model.getId(), dto.getId());
    assertEquals(model.getName(), dto.getName());
  }

  @Test
  void toModelTest() {
    TimeUnitDto dto = new TimeUnitDto();
    dto.setId(1L);
    dto.setName("name");

    TimeUnit model = TimeUnitDtoMapper.toModel(dto);

    assertEquals(dto.getId(), model.getId());
    assertEquals(dto.getName(), model.getName());
  }

}
