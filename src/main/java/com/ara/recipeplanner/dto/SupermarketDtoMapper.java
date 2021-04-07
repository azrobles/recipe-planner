package com.ara.recipeplanner.dto;

import com.ara.recipeplanner.model.Supermarket;

public class SupermarketDtoMapper {

  private SupermarketDtoMapper() {
    throw new IllegalStateException("Utility class");
  }
  
  public static SupermarketDto toDto(Supermarket model) {
    if (model == null) {
      return null;
    }

    SupermarketDto dto = new SupermarketDto();
    dto.setId(model.getId());
    dto.setName(model.getName());

    return dto;
  }

  public static Supermarket toModel(SupermarketDto dto) {
    if (dto == null) {
      return null;
    }
    
    return new Supermarket(dto.getId(), dto.getName());
  }

}
