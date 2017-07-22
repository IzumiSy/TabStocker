import Lockr from 'lockr';
import Constants from './constants';

Lockr.prefix = '_tabStocker_preference_';

const Prefs = {
  set(key, value) {
    Lockr.set(key, value);
  },

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

    _result = Lockr.get(key, _default);

    // Converting stringified boolean to the actual boolean
    if (_reuslt == 'true') return true;
    if (_result == 'false') return false;

    return _result;
  },
};

export default Prefs;
