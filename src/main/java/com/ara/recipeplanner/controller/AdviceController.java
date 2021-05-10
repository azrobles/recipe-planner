package com.ara.recipeplanner.controller;

import com.ara.recipeplanner.exception.EntityDuplicatedException;
import com.ara.recipeplanner.exception.EntityNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class AdviceController {

  @ResponseBody
  @ExceptionHandler(EntityNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  String entityNotFoundHandler(RuntimeException ex) {
    return ex.getMessage();
  }

  @ResponseBody
  @ExceptionHandler(EntityDuplicatedException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  String entityDuplicatedHandler(RuntimeException ex) {
    return ex.getMessage();
  }

  @ResponseBody
  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  String methodArgumentNotValidExceptionHandler(
      MethodArgumentNotValidException ex) {

    StringBuilder response = new StringBuilder();

    for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
      String fieldName = fieldError.getField();
      String errorMessage = fieldError.getDefaultMessage();
      response.append(fieldName + " " + errorMessage + ";");
    }

    return response.toString();
  }

}
