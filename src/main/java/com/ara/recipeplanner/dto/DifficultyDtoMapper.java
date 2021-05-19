package com.ara.recipeplanner.dto;

import com.ara.recipeplanner.model.Difficulty;

public class DifficultyDtoMapper {

  private DifficultyDtoMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static DifficultyDto toDto(Difficulty model) {
    if (model == null) {
      return null;
    }

    var dto = new DifficultyDto();
    dto.setId(model.getId());
    dto.setName(model.getName());

    return dto;
  }

  public static Difficulty toModel(DifficultyDto dto) {
    if (dto == null) {
      return null;
    }

    return new Difficulty(dto.getId(), dto.getName());
  }

}
