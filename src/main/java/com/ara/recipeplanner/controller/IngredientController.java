package com.ara.recipeplanner.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import com.ara.recipeplanner.dto.IngredientDto;
import com.ara.recipeplanner.dto.IngredientDtoMapper;
import com.ara.recipeplanner.exception.EntityDuplicatedException;
import com.ara.recipeplanner.exception.EntityNotFoundException;
import com.ara.recipeplanner.service.IngredientService;

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
@RequestMapping("/api/ingredients")
@Validated
public class IngredientController {

  private final IngredientService service;

  public IngredientController(IngredientService service) {
    this.service = service;
  }

  @GetMapping
  public List<IngredientDto> indexController() {

    return service.index().stream()
      .map(IngredientDtoMapper::toDto).collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public IngredientDto showController(@PathVariable Long id)
      throws EntityNotFoundException {

    return IngredientDtoMapper.toDto(service.show(id));
  }

  @PostMapping
  public IngredientDto createController(
      @Valid @RequestBody IngredientDto newIngredient)
      throws EntityDuplicatedException, EntityNotFoundException {

    return IngredientDtoMapper.toDto(
      service.create(IngredientDtoMapper.toModel(newIngredient)));
  }

  @PutMapping("/{id}")
  public IngredientDto updateController(
      @Valid @RequestBody IngredientDto newIngredient, @PathVariable Long id)
      throws EntityNotFoundException, EntityDuplicatedException {

    return IngredientDtoMapper.toDto(
      service.update(IngredientDtoMapper.toModel(newIngredient), id));
  }

  @DeleteMapping("/{id}")
  public void deleteController(@PathVariable Long id)
      throws EntityNotFoundException {

    service.delete(id);
  }

}
