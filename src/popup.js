import I from 'immutable';
import yo from 'yo-yo';
import Constants from './constants';
import Prefs from './preference';
import TabItem from './models/tabItem.js';
import LocalRepository from './repositories/local';
import SyncRepository from './repositories/sync';
import 'jquery-ui-bundle/jquery-ui.min.js';
import 'jquery-ui-bundle/jquery-ui.min.css';
import './styles.scss';

const BG = chrome.extension.getBackgroundPage();

const _updaters = {
  local: _listUpdater('local', I.List([])),
  sync: _listUpdater('sync', I.List([])),
};

/**
 * @function _listUpdater
 * @param {string} target
 * @param {object} items
 * @return {object} yo-yoified DOM object
 */
function _listUpdater(target, items) {
  const _items =
    Prefs.get(Constants.optionKeys.AUTO_SORT) ?
    TabItem.sort(items) : items;
  const popupHeight = Prefs.get(Constants.optionKeys.POPUP_HEIGHT);

  return yo`
    <ul id="items-${target}" role="menu" tabindex="0"
      class="items ui-menu ui-widget ui-widget-content"
      style="height: ${popupHeight}px;">
      ${_items.map((item) => item.listItemDOM()).toArray()}
    </ul>
  `;
};

/**
 * @function loadLocalStorageItems
 */
function loadLocalStorageItems() {
  const items = LocalRepository.getAll();
  const viewList = _listUpdater('local', items);
  yo.update(_updaters.local, viewList);
  chrome.browserAction.setBadgeText({
     text: String(items.size),
  });
};

/**
 * @function loadSyncStorageItems
 */
async function loadSyncStorageItems() {
  const items = await SyncRepository.getAll();
  const viewList = _listUpdater('sync', items);
  yo.update(_updaters.sync, viewList);
};

/**
 * @function stockCurrentTab
 * @param {TabItem} tabItem
 */
async function stockCurrentTab(tabItem) {
  switch (BG.currentTab) {
    case Constants.tabs.SYNC:
      await SyncRepository.append(tabItem);
      loadSyncStorageItems();
      break;
    case Constants.tabs.LOCAL:
    default:
      LocalRepository.append(tabItem);
      loadLocalStorageItems();
  }
}

$(function() {
  BG.utils.undefinedResolver();

  /* ***********
   *    Body
   * ***********/

  const $body = $('body');
  const fontSize = Prefs.get(Constants.optionKeys.FONT_SIZE);

  $body.css('font-size', `${fontSize}em`);
  $body.width(Prefs.get(Constants.optionKeys.POPUP_WIDTH));

  /* **************
   *    Buttons
   * **************/

  $('#add').on('click', () => {
    chrome.tabs.getSelected(window.id, (tab) => {
      stockCurrentTab(new TabItem({
        title: tab.title,
        url: tab.url,
      }));
    });
  });
  $('#options').on('click', () => {
    chrome.tabs.create({ url: 'dists/options.html', selected: true });
  });

  /* **********************
   *      Tabs Header
   * **********************/

  const $tabsArea = $('div#tabs');

  $tabsArea.tabs({
    active: BG.currentTab,
    activate(event, ui) {
      const newTabId = ui.newPanel.get(0).id;
      switch (newTabId) {
        case 'sync-tab':
          BG.currentTab = Constants.tabs.SYNC;
          break;
        case 'local-tab':
        default:
          BG.currentTab = Constants.tabs.LOCAL;
      }
    },
  });

  /* *************************
   *       Load items
   * *************************/

  const $localItems = document.getElementById('local-tab');
  $localItems.appendChild(_updaters.local);
  loadLocalStorageItems();

  const $syncItems = document.getElementById('sync-tab');
  $syncItems.appendChild(_updaters.sync);
  loadSyncStorageItems();

  /* ***********************
   *      Tab Contents
   * ***********************/

  const $itemsElement = $('.items');
  $itemsElement.menu();
});
