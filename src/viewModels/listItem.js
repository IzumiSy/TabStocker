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
    const _favicon = Prefs.get(Constants.optionKeys.HIDE_FAVICONS) ? null :
      yo`<img src="${this.faviconUrl}" class="item-favicon" />`;
    const _removeItem = (_e) => {/* TODO */};

    return yo`
      <li class="ui-menu-item">
        <div tabindex="-1" role="menuitem" class="ui-menu-item-wrapper">
          ${_favicon}
          <div onclick=${_openItem} class="item-title">${this.title}</div>
          <div onclick=${_removeItem} class="button__item-remove"></div>
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
   * @param {TabItem} model
   * @return {ListItem}
   */
  static fromModel(model) {
    return new ListItem(model.toJS());
  }
}
