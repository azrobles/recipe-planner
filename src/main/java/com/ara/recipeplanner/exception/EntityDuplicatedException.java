package com.ara.recipeplanner.exception;

public class EntityDuplicatedException extends RuntimeException {

  private static final long serialVersionUID = 1L;

  public EntityDuplicatedException(String entity) {
    super("Another " + entity + " with the same data exists");
  }

}
