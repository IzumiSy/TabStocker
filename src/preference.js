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
    localStorage.setItem(key, value);
  }

  /**
   * Gets data from the storage
   * @param {string} key
   * @return {*} The content associated with the given key
   */
  get(key) {
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

    const _result = localStorage.getItem(key);
    _result === null && _result = _default;

    // Converting stringified boolean to the actual boolean
    if (_result == 'true') return true;
    if (_result == 'false') return false;

    return _result;
  }
};
