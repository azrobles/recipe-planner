package com.ara.recipeplanner.dto;

import com.ara.recipeplanner.model.Quantity;

public class QuantityDtoMapper {

  private QuantityDtoMapper() {
    throw new IllegalStateException("Utility class");
  }

  public static QuantityDto toDto(Quantity model) {
    if (model == null) {
      return null;
    }

    var dto = new QuantityDto();
    dto.setAmount(model.getAmount());
    dto.setMeasureUnit(MeasureUnitDtoMapper.toDto(model.getMeasureUnit()));

    return dto;
  }

  public static Quantity toModel(QuantityDto dto) {
    if (dto == null) {
      return null;
    }

    return new Quantity(dto.getAmount(),
        MeasureUnitDtoMapper.toModel(dto.getMeasureUnit()));
  }

}
