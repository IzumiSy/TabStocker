import Lockr from 'lockr';
import { List } from 'immutable';

/** A wrapper class to manipulate LocalStorage */
export default new class StorageRepository {
  /**
   * Creates an instance of StorageRepository
   */
  constructor() {
    this.ItemData = List();
  }

  /**
   * Append one item to the storage
   */
  append() {
    switchPrefix();

    // TODO
  }

  /**
   * Delete one item from the storage
   */
  delete() {
    switchPrefix();

    // TODO
  }

  /**
   * Gets the size of stored items in the storage
   */
  count() {
    switchPrefix();

    // TODO
  }

  /**
   * Gets all item from the storage
   */
  getAll() {
    switchPrefix();

    // TODO
  }

  /**
   * Switches the key prefix
   */
  switchPrefix() {
    Lockr.prefix = '_tabStocker_data_';
  }
};
