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
   * @param {tab} tab
   */
  append(tab) {
    // TODO
  }

  /**
   * Gets all item from the storage
   * @return {array}
   */
  getAll() {
    const _result = localStorage.getItem(Constants.dataKey.localItem);
    return _result ? _result : [];
  }
};
