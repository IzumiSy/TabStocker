import { Record } from 'immutable';
import Prefs from '../preference';
import Constants from '../constants';

const TabItemRecord = Record({
  title: null,
  url: null,
});

/**
 * Domain Model for TabItem
 */
export default class TabItem extends TabItemRecord {
  /**
   * Creates an instance
   * @param {object} args the constructor parameter passed from Immutable.Record
   */
  constructor(args) {
    super(args);
    this.FAVICON_API = 'http://favicon.hatena.ne.jp/?url=';
    this.faviconUrl = this.FAVICON_API + this.url;
  }


  /**
   * @function sort
   * @param {I.List} items unsorted Immutable List object
   * @return {I.List} sorted Immutable List object
   */
  static sort(items) {
    let elements = null;
    let r = null;

    switch (Prefs.get(Constants.optionKeys.SORTBY)) {
      case 'by_title': elements = 'title'; break;
      case 'by_url': elements = 'url'; break;
    }
    return items.sort((a, b) => {
      switch (Prefs.get(Constants.optionKeys.DIRECTION)) {
        case 'asc': r = 1; break;
        case 'desc': r = -1; break;
      }
      if (a[elements] > b[elements]) return r;
      if (a[elements] < b[elements]) return -r;
      return 0;
    });
  }
}
