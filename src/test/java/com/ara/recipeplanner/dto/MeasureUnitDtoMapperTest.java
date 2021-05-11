package com.ara.recipeplanner.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.ara.recipeplanner.model.MeasureUnit;

import org.junit.jupiter.api.Test;

class MeasureUnitDtoMapperTest {

  @Test
  void toDtoTest() {
    MeasureUnit model = new MeasureUnit(1L, "name");

    MeasureUnitDto dto = MeasureUnitDtoMapper.toDto(model);

    assertEquals(model.getId(), dto.getId());
    assertEquals(model.getName(), dto.getName());
  }

  @Test
  void toModelTest() {
    MeasureUnitDto dto = new MeasureUnitDto();
    dto.setId(1L);
    dto.setName("name");

    MeasureUnit model = MeasureUnitDtoMapper.toModel(dto);

    assertEquals(dto.getId(), model.getId());
    assertEquals(dto.getName(), model.getName());
  }

}
