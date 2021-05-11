package com.ara.recipeplanner.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import com.ara.recipeplanner.dto.TimeUnitDto;
import com.ara.recipeplanner.dto.TimeUnitDtoMapper;
import com.ara.recipeplanner.exception.EntityDuplicatedException;
import com.ara.recipeplanner.exception.EntityNotFoundException;
import com.ara.recipeplanner.service.TimeUnitService;

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
@RequestMapping("/api/timeunits")
@Validated
public class TimeUnitController {

  private final TimeUnitService service;

  public TimeUnitController(TimeUnitService service) {
    this.service = service;
  }

  @GetMapping
  public List<TimeUnitDto> indexController() {

    return service.index().stream()
      .map(TimeUnitDtoMapper::toDto).collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public TimeUnitDto showController(@PathVariable Long id)
      throws EntityNotFoundException {

    return TimeUnitDtoMapper.toDto(service.show(id));
  }

  @PostMapping
  public TimeUnitDto createController(
      @Valid @RequestBody TimeUnitDto newTimeUnit)
      throws EntityDuplicatedException {

    return TimeUnitDtoMapper.toDto(
      service.create(TimeUnitDtoMapper.toModel(newTimeUnit)));
  }

  @PutMapping("/{id}")
  public TimeUnitDto updateController(
      @Valid @RequestBody TimeUnitDto newTimeUnit, @PathVariable Long id)
      throws EntityDuplicatedException {

    return TimeUnitDtoMapper.toDto(
      service.update(TimeUnitDtoMapper.toModel(newTimeUnit), id));
  }

  @DeleteMapping("/{id}")
  public void deleteController(@PathVariable Long id) {
    service.delete(id);
  }

}
