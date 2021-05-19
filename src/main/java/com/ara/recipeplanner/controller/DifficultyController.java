package com.ara.recipeplanner.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import com.ara.recipeplanner.dto.DifficultyDto;
import com.ara.recipeplanner.dto.DifficultyDtoMapper;
import com.ara.recipeplanner.exception.EntityDuplicatedException;
import com.ara.recipeplanner.exception.EntityNotFoundException;
import com.ara.recipeplanner.service.DifficultyService;

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
@RequestMapping("/api/difficulties")
@Validated
public class DifficultyController {

  private final DifficultyService service;

  public DifficultyController(DifficultyService service) {
    this.service = service;
  }

  @GetMapping
  public List<DifficultyDto> indexController() {

    return service.index().stream()
      .map(DifficultyDtoMapper::toDto).collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public DifficultyDto showController(@PathVariable Long id)
      throws EntityNotFoundException {

    return DifficultyDtoMapper.toDto(service.show(id));
  }

  @PostMapping
  public DifficultyDto createController(
      @Valid @RequestBody DifficultyDto newDifficulty)
      throws EntityDuplicatedException {

    return DifficultyDtoMapper.toDto(
      service.create(DifficultyDtoMapper.toModel(newDifficulty)));
  }

  @PutMapping("/{id}")
  public DifficultyDto updateController(
      @Valid @RequestBody DifficultyDto newDifficulty, @PathVariable Long id)
      throws EntityNotFoundException, EntityDuplicatedException {

    return DifficultyDtoMapper.toDto(
      service.update(DifficultyDtoMapper.toModel(newDifficulty), id));
  }

  @DeleteMapping("/{id}")
  public void deleteController(@PathVariable Long id)
      throws EntityNotFoundException {

    service.delete(id);
  }

}
