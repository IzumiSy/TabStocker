import yo from 'yo-yo';
import TabItem from '../models/tabItem';
import Prefs from '../preference';
import Constants from '../constants';

/**
 * View-Model for each item of list
 */
export default class ListItem extends TabItem {
  /**
   * @function getDOM
   * @return {object} yo-yo object
   */
  getDOM() {
    const _openItem = (_e) => ListItem.openItem(this);
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
   * @function fromModel
   * @param {TabItem}
   * @return {ListItem}
   */
  static fromModel(model) {
    return new ListItem(model.toJS())
  }
}
