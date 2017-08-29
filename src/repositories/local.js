import Lockr from 'lockr';
import Constants from './../constants';

/**
 * A wrapper class to manipulate LocalStorage
 */
export default new class LocalRepository {
  /**
   * Creates an instance
   */
  constructor() {}

  /**
   * Append one item to the storage
   */
  append(tab) {
    // TODO
  }

  /**
   * Gets all item from the storage
   * @return {array}
   */
  getAll() {
    return Lockr.get(Constants.dataKey.localItem, []);
  }
};
