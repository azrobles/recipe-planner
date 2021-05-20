package com.ara.recipeplanner.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import com.ara.recipeplanner.dto.RecipeTypeDto;
import com.ara.recipeplanner.dto.RecipeTypeDtoMapper;
import com.ara.recipeplanner.exception.EntityDuplicatedException;
import com.ara.recipeplanner.exception.EntityNotFoundException;
import com.ara.recipeplanner.service.RecipeTypeService;

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
@RequestMapping("/api/recipetypes")
@Validated
public class RecipeTypeController {

  private final RecipeTypeService service;

  public RecipeTypeController(RecipeTypeService service) {
    this.service = service;
  }

  @GetMapping
  public List<RecipeTypeDto> indexController() {

    return service.index().stream()
      .map(RecipeTypeDtoMapper::toDto).collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public RecipeTypeDto showController(@PathVariable Long id)
      throws EntityNotFoundException {

    return RecipeTypeDtoMapper.toDto(service.show(id));
  }

  @PostMapping
  public RecipeTypeDto createController(
      @Valid @RequestBody RecipeTypeDto newRecipeType)
      throws EntityDuplicatedException {

    return RecipeTypeDtoMapper.toDto(
      service.create(RecipeTypeDtoMapper.toModel(newRecipeType)));
  }

  @PutMapping("/{id}")
  public RecipeTypeDto updateController(
      @Valid @RequestBody RecipeTypeDto newRecipeType, @PathVariable Long id)
      throws EntityNotFoundException, EntityDuplicatedException {

    return RecipeTypeDtoMapper.toDto(
      service.update(RecipeTypeDtoMapper.toModel(newRecipeType), id));
  }

  @DeleteMapping("/{id}")
  public void deleteController(@PathVariable Long id)
      throws EntityNotFoundException {

    service.delete(id);
  }

}
