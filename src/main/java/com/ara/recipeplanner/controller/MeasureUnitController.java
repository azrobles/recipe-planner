package com.ara.recipeplanner.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import com.ara.recipeplanner.dto.MeasureUnitDto;
import com.ara.recipeplanner.dto.MeasureUnitDtoMapper;
import com.ara.recipeplanner.exception.EntityNotFoundException;
import com.ara.recipeplanner.service.MeasureUnitService;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/measureunits")
@Validated
public class MeasureUnitController {

  private final MeasureUnitService service;

  public MeasureUnitController(MeasureUnitService service) {
    this.service = service;
  }

  @GetMapping
  public List<MeasureUnitDto> indexController() {

    return service.index().stream()
      .map(MeasureUnitDtoMapper::toDto).collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public MeasureUnitDto showController(@PathVariable Long id)
      throws EntityNotFoundException {

    return MeasureUnitDtoMapper.toDto(service.show(id));
  }

  @PostMapping
  public MeasureUnitDto createController(
      @Valid @RequestBody MeasureUnitDto newMeasureUnit) {

    return MeasureUnitDtoMapper.toDto(
      service.create(MeasureUnitDtoMapper.toModel(newMeasureUnit)));
  }

  @PutMapping("/{id}")
  public MeasureUnitDto updateController(
      @Valid @RequestBody MeasureUnitDto newMeasureUnit,
      @PathVariable Long id) {

    return MeasureUnitDtoMapper.toDto(
      service.update(MeasureUnitDtoMapper.toModel(newMeasureUnit), id));
  }

  @DeleteMapping("/{id}")
  public void deleteController(@PathVariable Long id) {
    service.delete(id);
  }

}
