package com.ara.recipeplanner.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import com.ara.recipeplanner.dto.LocationDto;
import com.ara.recipeplanner.dto.LocationDtoMapper;
import com.ara.recipeplanner.exception.EntityDuplicatedException;
import com.ara.recipeplanner.exception.EntityNotFoundException;
import com.ara.recipeplanner.service.LocationService;

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
@RequestMapping("/api/locations")
@Validated
public class LocationController {

  private final LocationService service;

  public LocationController(LocationService service) {
    this.service = service;
  }

  @GetMapping
  public List<LocationDto> indexController() {

    return service.index().stream()
      .map(LocationDtoMapper::toDto).collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public LocationDto showController(@PathVariable Long id)
      throws EntityNotFoundException {

    return LocationDtoMapper.toDto(service.show(id));
  }

  @PostMapping
  public LocationDto createController(
      @Valid @RequestBody LocationDto newLocation)
      throws EntityDuplicatedException {

    return LocationDtoMapper.toDto(
      service.create(LocationDtoMapper.toModel(newLocation)));
  }

  @PutMapping("/{id}")
  public LocationDto updateController(
      @Valid @RequestBody LocationDto newLocation, @PathVariable Long id)
      throws EntityNotFoundException, EntityDuplicatedException {

    return LocationDtoMapper.toDto(
      service.update(LocationDtoMapper.toModel(newLocation), id));
  }

  @DeleteMapping("/{id}")
  public void deleteController(@PathVariable Long id)
      throws EntityNotFoundException {

    service.delete(id);
  }

}
