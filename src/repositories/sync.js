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
   */
  append() {
    // TODO
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
};
