import I from 'immutable';
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
   * @param {TabItem} tabItem the tabItem to store
   * @return {number} the size of stored items after update.
   */
  append(tabItem) {
    if (this.isDuplicated(tabItem)) {
      return 0;
    }
    const items = this.getAll();
    const updatedItems = items.push(tabItem.toJS());
    const _jsonified = JSON.stringify(updatedItems.toJS());
    localStorage.setItem(Constants.dataKey.localItem, _jsonified);
    return updatedItems.size;
  }

  /**
   * Delete one item from the storage
   * @param {TabItem} tabItem the tabItem to delete from storage.
   * @return {number} the size of stored item after delete.
   */
  delete(tabItem) {
    const items = this.getAll();
    //
    // TODO
    //
    return items.size;
  }

  /**
   * Gets all item from the storage
   * @return {I.List} Items stored in localStorage
   */
  getAll() {
    const _result = localStorage.getItem(Constants.dataKey.localItem);
    const _jsonified = JSON.parse(_result);
    return I.List(_jsonified);
  }

  /**
   * Checks if the given tabItem is duplicated in stored items
   * @param {TabItem} tabItem the tabItem to check
   * @return {boolean} if it is duplicated or not
   */
  isDuplicated(tabItem) {
    const items = this.getAll();
    //
    // TODO
    //
    return false;
  }
};
