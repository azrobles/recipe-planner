package com.ara.recipeplanner.dto;

import com.ara.recipeplanner.model.MeasureUnit;

public class MeasureUnitDtoMapper {

  private MeasureUnitDtoMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static MeasureUnitDto toDto(MeasureUnit model) {
    if (model == null) {
      return null;
    }

    MeasureUnitDto dto = new MeasureUnitDto();
    dto.setId(model.getId());
    dto.setName(model.getName());

    return dto;
  }

  public static MeasureUnit toModel(MeasureUnitDto dto) {
    if (dto == null) {
      return null;
    }

    return new MeasureUnit(dto.getId(), dto.getName());
  }

}
