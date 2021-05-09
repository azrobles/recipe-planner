package com.ara.recipeplanner.dto;

import com.ara.recipeplanner.model.Availability;

public class AvailabilityDtoMapper {

  private AvailabilityDtoMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static AvailabilityDto toDto(Availability model) {
    if (model == null) {
      return null;
    }

    AvailabilityDto dto = new AvailabilityDto();
    dto.setId(model.getId());
    dto.setName(model.getName());

    return dto;
  }

  public static Availability toModel(AvailabilityDto dto) {
    if (dto == null) {
      return null;
    }

    return new Availability(dto.getId(), dto.getName());
  }

}
