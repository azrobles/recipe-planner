package com.ara.recipeplanner.controller;

import java.util.List;
import java.util.stream.Collectors;

import com.ara.recipeplanner.dto.SupermarketDto;
import com.ara.recipeplanner.dto.SupermarketDtoMapper;
import com.ara.recipeplanner.exception.EntityNotFoundException;
import com.ara.recipeplanner.service.SupermarketService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/supermarkets")
public class SupermarketController {

  private final SupermarketService service;

  public SupermarketController(SupermarketService service) {
    this.service = service;
  }

  @GetMapping
  public List<SupermarketDto> indexController() {

    return service.index().stream()
      .map(SupermarketDtoMapper::toDto).collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public SupermarketDto showController(@PathVariable Long id)
      throws EntityNotFoundException {

    return SupermarketDtoMapper.toDto(service.show(id));
  }

  @PostMapping
  public SupermarketDto createController(
        @RequestBody SupermarketDto newSupermarket) {

    return SupermarketDtoMapper.toDto(
      service.create(SupermarketDtoMapper.toModel(newSupermarket)));
  }

  @PutMapping("/{id}")
  public SupermarketDto updateController(
      @RequestBody SupermarketDto newSupermarket, @PathVariable Long id) {

    return SupermarketDtoMapper.toDto(
      service.update(SupermarketDtoMapper.toModel(newSupermarket), id));
  }

  @DeleteMapping("/{id}")
  public void deleteController(@PathVariable Long id) {
    service.delete(id);
  }

}
