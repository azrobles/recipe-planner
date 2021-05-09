package com.ara.recipeplanner.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.ara.recipeplanner.model.Availability;

import org.junit.jupiter.api.Test;

class AvailabilityDtoMapperTest {

  @Test
  void toDtoTest() {
    Availability model = new Availability(1L, "name");

    AvailabilityDto dto = AvailabilityDtoMapper.toDto(model);

    assertEquals(model.getId(), dto.getId());
    assertEquals(model.getName(), dto.getName());
  }

  @Test
  void toModelTest() {
    AvailabilityDto dto = new AvailabilityDto();
    dto.setId(1L);
    dto.setName("name");

    Availability model = AvailabilityDtoMapper.toModel(dto);

    assertEquals(dto.getId(), model.getId());
    assertEquals(dto.getName(), model.getName());
  }

}
