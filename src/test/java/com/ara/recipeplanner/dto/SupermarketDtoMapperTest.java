package com.ara.recipeplanner.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.ara.recipeplanner.model.Supermarket;

import org.junit.jupiter.api.Test;

class SupermarketDtoMapperTest {
  
  @Test
  void toDtoTest() {
    Supermarket model = new Supermarket(1L, "name");

    SupermarketDto dto = SupermarketDtoMapper.toDto(model);

    assertEquals(model.getId(), dto.getId());
    assertEquals(model.getName(), dto.getName());
  }

  @Test
  void toModelTest() {
    SupermarketDto dto = new SupermarketDto();
    dto.setId(1L);
    dto.setName("name");
    
    Supermarket model = SupermarketDtoMapper.toModel(dto);
    
    assertEquals(dto.getId(), model.getId());
    assertEquals(dto.getName(), model.getName());
  }
  
}
