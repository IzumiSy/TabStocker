import Lockr from 'lockr';
import Constants from './constants';

/**
 * A wrapper class to manipulate localStraoge to store user prefetences
 */
export default new class Prefs {
  /**
   * Creates an instance of Prefs
   */
  constructor() {}

  /**
   * Store data into the storage
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    this.switchPrefix();
    Lockr.set(key, value);
  }

  /**
   * Gets data from the storage
   * @param {string} key
   * @return {*} The content associated with the given key
   */
  get(key) {
    this.switchPrefix();

    let _default = undefined;

    switch (key) {
      case Constants.optionKeys.POPUP_WIDTH:
        _default = Constants.default.popupWidth;
        break;
      case Constants.optionKeys.POPUP_HEIGHT:
        _default = Constants.default.popupHeight;
        break;
      case Constants.optionKeys.FONT_SIZE:
        _default = Constants.default.fontSize;
        break;
    };

    const _result = Lockr.get(key, _default);

    // Converting stringified boolean to the actual boolean
    if (_result == 'true') return true;
    if (_result == 'false') return false;

    return _result;
  }

  /**
   * Switches the key prefix
   */
  switchPrefix() {
    Lockr.prefix = '_tabStocker_preference_';
  }
};
