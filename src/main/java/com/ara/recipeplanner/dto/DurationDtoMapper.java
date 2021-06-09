package com.ara.recipeplanner.dto;

import com.ara.recipeplanner.model.Duration;

public class DurationDtoMapper {

  private DurationDtoMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static DurationDto toDto(Duration model) {
    if (model == null) {
      return null;
    }

    var dto = new DurationDto();
    dto.setAmount(model.getAmount());
    dto.setTimeUnit(TimeUnitDtoMapper.toDto(model.getTimeUnit()));

    return dto;
  }

  public static Duration toModel(DurationDto dto) {
    if (dto == null) {
      return null;
    }

    return new Duration(dto.getAmount(),
        TimeUnitDtoMapper.toModel(dto.getTimeUnit()));
  }

}
