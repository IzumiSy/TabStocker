import { Record } from 'immutable';
import yo from 'yo-yo';
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
   * @function getDOM
   * @return {object} yo-yo object
   */
  getDOM() {
    const _openItem = (_e) => TabItem.openItem(this);
    return yo`
      <li class="ui-menu-item">
        <div onclick=${_openItem} tabindex="-1" role="menuitem" class="ui-menu-item-wrapper">
          <img src="${this.faviconUrl}" class="item-favicon" />
          <div class="item-title">${this.title}</div>
        </div>
      </li>
    `;
  }

  /**
   * @function openItem
   * @param {TabItem} tabItem a tabItem to open
   */
  static openItem(tabItem) {
    if (Prefs.get(Constants.optionKeys.NO_NEW_TAB)) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        selectedTab = tabs[0];
        chrome.tabs.update(selectedTab.id, { url: tabItem.url });
      });
    } else {
      chrome.tabs.create({ url: tabItem.url, selected: false });
    }
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
