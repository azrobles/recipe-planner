package com.ara.recipeplanner.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import com.ara.recipeplanner.dto.RecipeDto;
import com.ara.recipeplanner.dto.RecipeDtoMapper;
import com.ara.recipeplanner.exception.EntityDuplicatedException;
import com.ara.recipeplanner.exception.EntityNotFoundException;
import com.ara.recipeplanner.service.RecipeService;

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
@RequestMapping("/api/recipes")
@Validated
public class RecipeController {

  private final RecipeService service;

  public RecipeController(RecipeService service) {
    this.service = service;
  }

  @GetMapping
  public List<RecipeDto> indexController() {

    return service.index().stream()
      .map(RecipeDtoMapper::toDto).collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public RecipeDto showController(@PathVariable Long id)
      throws EntityNotFoundException {

    return RecipeDtoMapper.toDto(service.show(id));
  }

  @PostMapping
  public RecipeDto createController(
      @Valid @RequestBody RecipeDto newRecipe)
      throws EntityDuplicatedException, EntityNotFoundException {

    return RecipeDtoMapper.toDto(
      service.create(RecipeDtoMapper.toModel(newRecipe)));
  }

  @PutMapping("/{id}")
  public RecipeDto updateController(
      @Valid @RequestBody RecipeDto newRecipe, @PathVariable Long id)
      throws EntityNotFoundException, EntityDuplicatedException {

    return RecipeDtoMapper.toDto(
      service.update(RecipeDtoMapper.toModel(newRecipe), id));
  }

  @DeleteMapping("/{id}")
  public void deleteController(@PathVariable Long id)
      throws EntityNotFoundException {

    service.delete(id);
  }

}
