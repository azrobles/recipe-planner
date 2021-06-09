package com.ara.recipeplanner.dto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.math.BigDecimal;

import com.ara.recipeplanner.model.Duration;
import com.ara.recipeplanner.model.TimeUnit;

import org.junit.jupiter.api.Test;

class DurationDtoMapperTest {

  @Test
  void toDtoTest() {
    Duration model = new Duration(new BigDecimal(1), new TimeUnit());

    DurationDto dto = DurationDtoMapper.toDto(model);

    assertEquals(model.getAmount(), dto.getAmount());
    assertNotNull(dto.getTimeUnit());
  }

  @Test
  void toModelTest() {
    DurationDto dto = new DurationDto();
    dto.setAmount(new BigDecimal(1));
    dto.setTimeUnit(new TimeUnitDto());

    Duration model = DurationDtoMapper.toModel(dto);

    assertEquals(dto.getAmount(), model.getAmount());
    assertNotNull(model.getTimeUnit());
  }

}
