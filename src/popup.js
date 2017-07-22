import $ from 'jquery';
import yo from 'yo-yo';
import Constants from './constants';
import Prefs from './preference';
import LocalRepository from './repositories/local';
import SyncRepository from './repositories/sync';

const BG = chrome.extension.getBackgroundPage();

const ITEMS_LOCAL_TAB = 0;
const ITEMS_SYNC_TAB = 1;

const FAVICON_API = 'http://favicon.hatena.ne.jp/?url=';
const _updaters = {
  local: _listUpdater('local', []),
  sync: _listUpdater('sync', []),
};

/**
 * @function _listUpdater
 * @param {string} target
 * @param {object} items
 * @return {object} yo-yoified DOM object
 */
function _listUpdater(target, items) {
  const $items = (
    Prefs.get(Constants.optionKeys.AUTO_SORT) ?
    BG.utils.sorting(items) : items
  ).map((item) => {
    const _openItem = (_e) => {
      openStockedItem(item);
    };
    return yo`
      <li>
        <div onclick=${_openItem}>
          <img src="${FAVICON_API + item.url}" class="item-favicon" />
          <div class="item-title">${item.title}</div>
        </div>
      </li>
    `;
  });

  return yo`
    <ul id="items-${target}" class="items">
      ${$items}
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
     text: String(items.length),
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
 * @param {object} tab
 */
function stockCurrentTab(tab) {
  /*
  switch (BG.currentTab) {
    case ITEMS_LOCAL_TAB:
      // stockItems.append(tab);
      break;
    case ITEMS_SYNC_TAB:
      // stockItems.appendSync(tab);
      break;
    default:
      // TODO
  }

  //  if (BG.currentTab === 'items-local') {
  //    if (!BG.utils.isDuplicated(tab.url)) {
  //
  //    } else {
  //      BG.notifications.error();
  //    }
  //  } else { // === "items-sync"
  //
  //   }

  */
}

/**
 * @function openSelectedItem
 * @param {object} item
 */
function openStockedItem(item) {
  if (Prefs.get(Constants.optionKeys.NO_NEW_TAB)) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      selectedTab = tabs[0];
      chrome.tabs.update(selectedTab.id, { url: item.url });
    });
  } else {
    chrome.tabs.create({ url: item.url, selected: false });
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

  const $addButton = $('#add');
  const $optionButton = $('#options');

  $addButton.button();
  $optionButton.button();
  $addButton.on('click', () => {
    chrome.tabs.getSelected(window.id, (tab) => {
      stockCurrentTab(tab);
    });
  });
  $optionButton.on('click', () => {
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
          BG.currentTab = ITEMS_SYNC_TAB;
          break;
        case 'local-tab':
        default:
          BG.currentTab = ITEMS_LOCAL_TAB;
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
  const itemSelectHandler = function(event, ui) {
    openSelectedItem(ui.item);
  };

  setTimeout(() => {
    $itemsElement.height(Prefs.get(Constants.optionKeys.POPUP_HEIGHT));
    $itemsElement.menu({
      select: itemSelectHandler,
    });
  });
  /*
  if (!Prefs.get(Constants.optionKeys.AUTO_SORT)) {
    $itemsElement.sortable({
      placeholder: 'ui-state-highlight',
      update: stockItems.orderedSave,
    }).disableSelection();
  }
  */
});

// This is required to use jquery-ui
window.jQuery = $;
