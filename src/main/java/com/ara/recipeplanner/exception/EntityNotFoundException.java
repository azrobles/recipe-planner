package com.ara.recipeplanner.exception;

public class EntityNotFoundException extends RuntimeException {

  private static final long serialVersionUID = 1L;

  public EntityNotFoundException(String entity, String id) {
    super("Could not find " + entity + " " + id);
  }

}
