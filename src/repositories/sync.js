import I from 'immutable';
import Constants from '../constants';
import TabItem from '../models/tabItem';

/**
 * A wrapper class to manipulate chrome.storage.sync
 */
export default new class SyncRepository {
  /**
   * Creates an instance
   */
  constructor() {}

  /**
   * Method to append item to ItemData
   * @param {TabItem} tabItem the tabItem to store
   * @return {Promise<number>} the size of items after update
   */
  async append(tabItem) {
    const items = await this.getAll();
    const updatedItems = items.push(tabItem);
    const _jsonified = JSON.stringify(updatedItems.toArray());
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ [Constants.dataKey.syncItem]: _jsonified }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }
        resolve(updatedItems.size);
      });
    });
  }

  /**
   * Delete one item from the sync storage
   * @param {TabItem} tabItem the tabItem to delete
   * @return {number} the size of stored item afte deletion
   */
  async delete(tabItem) {
    const items = await this.getAll();
    //
    // TODO
    //
    return items.size;
  }

  /**
   * Method to get all data from the storage
   * @return {Promise<I.List>} the tabItem instances
   */
  getAll() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(Constants.dataKey.syncItem, (data) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }
        let _data = data[Constants.dataKey.syncItem];
        if (typeof _data === 'undefined') {
          _data = [];
        }
        const _jsonified = JSON.parse(_data);
        resolve(I.List(_jsonified.map((item) => new TabItem(item))));
      });
    });
  }
};
