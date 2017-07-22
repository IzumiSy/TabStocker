import Lockr from 'lockr';
import Constants from './constants';

/**
 * A wrapper class to manipulate LocalStorage
 */
export default new class StorageRepository {
  /**
   * Creates an instance
   */
  constructor() {}

  /**
   * Append one item to the storage
   */
  append() {
    this.resetPrefix();
    // TODO
  }

  /**
   * Gets all item from the storage
   * @return {array}
   */
  getAll() {
    this.resetPrefix();
    return Lockr.get(Constants.dataKey.localItem, []);
  }

  /**
   * Reset the key prefix
   */
  resetPrefix() {
    Lockr.prefix = null;
  }
};
