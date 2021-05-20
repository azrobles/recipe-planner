package com.ara.recipeplanner.dto;

import com.ara.recipeplanner.model.Season;

public class SeasonDtoMapper {

  private SeasonDtoMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static SeasonDto toDto(Season model) {
    if (model == null) {
      return null;
    }

    var dto = new SeasonDto();
    dto.setId(model.getId());
    dto.setName(model.getName());

    return dto;
  }

  public static Season toModel(SeasonDto dto) {
    if (dto == null) {
      return null;
    }

    return new Season(dto.getId(), dto.getName());
  }

}
