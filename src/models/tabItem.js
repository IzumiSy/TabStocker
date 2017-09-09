import { Record } from 'immutable';

const TabItemRecord = Record({
  title: null,
  url: null,
});

/**
 * Domain Model for TabItem
 */
export default class TabItem extends TabItemRecord {
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
