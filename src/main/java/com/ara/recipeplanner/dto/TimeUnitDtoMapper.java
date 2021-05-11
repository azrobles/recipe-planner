package com.ara.recipeplanner.dto;

import com.ara.recipeplanner.model.TimeUnit;

public class TimeUnitDtoMapper {

  private TimeUnitDtoMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static TimeUnitDto toDto(TimeUnit model) {
    if (model == null) {
      return null;
    }

    TimeUnitDto dto = new TimeUnitDto();
    dto.setId(model.getId());
    dto.setName(model.getName());

    return dto;
  }

  public static TimeUnit toModel(TimeUnitDto dto) {
    if (dto == null) {
      return null;
    }

    return new TimeUnit(dto.getId(), dto.getName());
  }

}
