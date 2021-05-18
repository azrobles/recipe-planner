package com.ara.recipeplanner.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.ara.recipeplanner.model.Location;

import org.junit.jupiter.api.Test;

class LocationDtoMapperTest {

  @Test
  void toDtoTest() {
    Location model = new Location(1L, "name");

    LocationDto dto = LocationDtoMapper.toDto(model);

    assertEquals(model.getId(), dto.getId());
    assertEquals(model.getName(), dto.getName());
  }

  @Test
  void toModelTest() {
    LocationDto dto = new LocationDto();
    dto.setId(1L);
    dto.setName("name");

    Location model = LocationDtoMapper.toModel(dto);

    assertEquals(dto.getId(), model.getId());
    assertEquals(dto.getName(), model.getName());
  }

}
