package com.ara.recipeplanner.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import com.ara.recipeplanner.dto.SeasonDto;
import com.ara.recipeplanner.dto.SeasonDtoMapper;
import com.ara.recipeplanner.exception.EntityDuplicatedException;
import com.ara.recipeplanner.exception.EntityNotFoundException;
import com.ara.recipeplanner.service.SeasonService;

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
@RequestMapping("/api/seasons")
@Validated
public class SeasonController {

  private final SeasonService service;

  public SeasonController(SeasonService service) {
    this.service = service;
  }

  @GetMapping
  public List<SeasonDto> indexController() {

    return service.index().stream()
      .map(SeasonDtoMapper::toDto).collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public SeasonDto showController(@PathVariable Long id)
      throws EntityNotFoundException {

    return SeasonDtoMapper.toDto(service.show(id));
  }

  @PostMapping
  public SeasonDto createController(
      @Valid @RequestBody SeasonDto newSeason)
      throws EntityDuplicatedException {

    return SeasonDtoMapper.toDto(
      service.create(SeasonDtoMapper.toModel(newSeason)));
  }

  @PutMapping("/{id}")
  public SeasonDto updateController(
      @Valid @RequestBody SeasonDto newSeason, @PathVariable Long id)
      throws EntityNotFoundException, EntityDuplicatedException {

    return SeasonDtoMapper.toDto(
      service.update(SeasonDtoMapper.toModel(newSeason), id));
  }

  @DeleteMapping("/{id}")
  public void deleteController(@PathVariable Long id)
      throws EntityNotFoundException {

    service.delete(id);
  }

}
