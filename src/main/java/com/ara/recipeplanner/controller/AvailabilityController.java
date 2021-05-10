package com.ara.recipeplanner.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import com.ara.recipeplanner.dto.AvailabilityDto;
import com.ara.recipeplanner.dto.AvailabilityDtoMapper;
import com.ara.recipeplanner.exception.EntityNotFoundException;
import com.ara.recipeplanner.service.AvailabilityService;

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
@RequestMapping("/api/availabilities")
@Validated
public class AvailabilityController {

  private final AvailabilityService service;

  public AvailabilityController(AvailabilityService service) {
    this.service = service;
  }

  @GetMapping
  public List<AvailabilityDto> indexController() {

    return service.index().stream()
      .map(AvailabilityDtoMapper::toDto).collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public AvailabilityDto showController(@PathVariable Long id)
      throws EntityNotFoundException {

    return AvailabilityDtoMapper.toDto(service.show(id));
  }

  @PostMapping
  public AvailabilityDto createController(
      @Valid @RequestBody AvailabilityDto newAvailability) {

    return AvailabilityDtoMapper.toDto(
      service.create(AvailabilityDtoMapper.toModel(newAvailability)));
  }

  @PutMapping("/{id}")
  public AvailabilityDto updateController(
      @Valid @RequestBody AvailabilityDto newAvailability,
      @PathVariable Long id) {

    return AvailabilityDtoMapper.toDto(
      service.update(AvailabilityDtoMapper.toModel(newAvailability), id));
  }

  @DeleteMapping("/{id}")
  public void deleteController(@PathVariable Long id) {
    service.delete(id);
  }

}
