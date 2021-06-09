package com.ara.recipeplanner.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.math.BigDecimal;

import com.ara.recipeplanner.model.MeasureUnit;
import com.ara.recipeplanner.model.Quantity;

import org.junit.jupiter.api.Test;

class QuantityDtoMapperTest {

  @Test
  void toDtoTest() {
    Quantity model = new Quantity(new BigDecimal(1), new MeasureUnit());

    QuantityDto dto = QuantityDtoMapper.toDto(model);

    assertEquals(model.getAmount(), dto.getAmount());
    assertNotNull(dto.getMeasureUnit());
  }

  @Test
  void toModelTest() {
    QuantityDto dto = new QuantityDto();
    dto.setAmount(new BigDecimal(1));
    dto.setMeasureUnit(new MeasureUnitDto());

    Quantity model = QuantityDtoMapper.toModel(dto);

    assertEquals(dto.getAmount(), model.getAmount());
    assertNotNull(model.getMeasureUnit());
  }

}
