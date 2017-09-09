import I from 'immutable';
import Constants from './../constants';

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
   * @return {number} the size of items after update
   */
  async append(tabItem) {
    if (await this.isDuplicated(tabItem)) {
      return 0
    }
    const items = await this.getAll();
    //
    // TODO
    //
    return items.size;
  }

  async delete(tabItem) {
    const items = await this.getAll();
    //
    // TODO
    //
    return items.size;
  }

  /**
   * Method to get all data from the storage
   * @return {array}
   */
  getAll() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(Constants.dataKey.syncItem, (data) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }
        const _data = data[Constants.dataKey.syncItem] || [];
        resolve(I.List(_data));
      });
    });
  }

  /**
   * Checks if the given tabItem is duplicated in stored items
   * @param {TabItem} tabItem the tabItem to check
   * @return {boolean} if it is duplicated or not
   */
  async isDuplicated(tabItem) {
    const items = await this.getAll();
    //
    // TODO
    //
    return false
  }
};
