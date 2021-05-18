package com.ara.recipeplanner.dto;

import com.ara.recipeplanner.model.Location;

public class LocationDtoMapper {

  private LocationDtoMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static LocationDto toDto(Location model) {
    if (model == null) {
      return null;
    }

    var dto = new LocationDto();
    dto.setId(model.getId());
    dto.setName(model.getName());

    return dto;
  }

  public static Location toModel(LocationDto dto) {
    if (dto == null) {
      return null;
    }

    return new Location(dto.getId(), dto.getName());
  }

}
