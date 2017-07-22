import Lockr from 'lockr';

Lockr.prefix = '_tabStocker_';

/** A wrapper class to manipulate LocalStorage */
export default class StorageRepository {
  /**
   * Creates an instance of StorageRepository
   */
  constructor() {}

  /**
   * Append one item to the storage
   */
  append() {
    // TODO
  }

  /**
   * Delete one item from the storage
   */
  delete() {
    // TODO
  }

  /**
   * Gets the size of stored items in the storage
   */
  count() {
    // TODO
  }

  /**
   * Gets all item from the storage
   */
  getAll() {
    Lockr.getAll();
  }
};
