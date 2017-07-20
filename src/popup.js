import $ from 'jquery';
import yo from 'yo-yo';

//
// popup.js
//


const ITEMS_SYNC_TAB = 0;
const ITEMS_LOCAL_TAB = 1;

const BG = chrome.extension.getBackgroundPage();

const isArrayValid = function(n) {
  return (n !== null && n !== undefined && n.length > 0);
};

/*
const stockItems = {
  append: function(item) {
    this.applyUI.appendItem(item.title, item.url, BG.currentTab);
    BG.storageUpdater.appendItem(item.title, item.url, BG.currentTab);
  },

  // TODO:
  // BG.isDuplicated() cannot be used for sync tab
  // This is just a workaround that should be re-written.
  appendSync: function(tab) {
    chrome.storage.sync.get("items", function(data) {
      if (chrome.runtime.lastError) {
        return;
      }
      var items = data.items;
      var isDupe = false;
      if (isArrayValid(items)) {
        items.forEach(function(item, i) {
          if (item["url"] === tab.url) {
            BG.notifications.error();
            isDupe = true;
          }
        });
      }
      if (!isDupe)
          stockItems.append(tab);
    });
  },

  eliminate: function(item) {
    this.applyUI.eliminateItem(item["index"], BG.currentTab);
    BG.storageUpdater.eliminateItem(item["title"], BG.currentTab);
  },

  launch: function(title) {
    var items = [];

    if (BG.currentTab === "items-local") {
      items = JSON.parse(localStorage.getItem(BG.ITEMS_ID));
      stockItems.execute(items, title);
    } else { // === "items-sync"
      chrome.storage.sync.get("items", function(data) {
        if (chrome.runtime.lastError || !isArrayValid(data.items)) {
          return;
        }
        items = data.items || items;
        stockItems.execute(items, title);
      });
    }
  },

  execute: function(array, title) {
    var queryCallback = function(tabs) {
      selectedTab = tabs[0];
      chrome.tabs.update(selectedTab.id, { url: array[i]["url"] });
    };

    for (var i in array) {
      if (array[i]["title"] == title) {
        if (localStorage.getItem(BG.OPTIONS.NO_NEW_TAB) == "true") {
          chrome.tabs.query({ active: true, currentWindow: true }, queryCallback);
        } else {
          chrome.tabs.create({url: array[i]["url"], selected: false});
        }
        break;
      }
    }
  },

  reorder: function(array) {
    var storageLength = array.length;
    var targetList;
    var temps = [];
    var url;

    if (BG.currentTab == "items-local") {
      targetList = $("#local li");
    } else { // == "items-sync"
      targetList = $("#sync li");
    }

    for (i = 0;i < targetList.length ;i++) {
      title = targetList[i].textContent;
      url = undefined;
      for (var j in array) {
        if (array[j]["title"] == title) {
          url = array[j]["url"];
          temps.push({"title": title, "url": url});
          break;
        }
      }
    }

    return temps;
  },

  orderedSave: function() {
    var items;
    var orderedItems;

    if (BG.currentTab == "items-local") {
      items = JSON.parse(localStorage.getItem(BG.ITEMS_ID));
      orderedItems = JSON.stringify(stockItems.reorder(items));
      localStorage.setItem(BG.ITEMS_ID, orderedItems);
    } else { // == "items-sync"
      chrome.storage.sync.get("items", function(data) {
        if (chrome.runtime.lastError || !isArrayValid(data.items)) {
          return;
        }
        chrome.storage.sync.set({ "items": stockItems.reorder(data.items) }, function() {
          console.log("Reordered: items-sync");
        });
      });
    }
  },
};
*/




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
  const $items = items.map((item) => {
    const imageSource = FAVICON_API + item.url;
    return yo`
      <li>
        <div>
          <img src="${imageSource}" class="item-favicon" />
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
  const isSortOn = (localStorage.getItem(BG.OPTIONS.AUTO_SORT) == 'true');
  const data = localStorage.getItem(BG.ITEMS_ID);

  if (!isArrayValid(data)) {
    return;
  }

  let items = JSON.parse(data);
  items = isSortOn ? BG.utils.sorting(items) : items;

  const viewList = _listUpdater('local', items);
  yo.update(_updaters.local, viewList);

  chrome.browserAction.setBadgeText({text: String(items.length)});
};

/**
 * @function loadSyncStorageItems
 */
function loadSyncStorageItems() {
  const isSortOn = (localStorage.getItem(BG.OPTIONS.AUTO_SORT) == 'true');
  chrome.storage.sync.get('items', function(data) {
    if (chrome.runtime.lastError || !isArrayValid(data)) {
      return;
    }

    let items = isSortOn ? BG.utils.sorting(data.items) : data.items;

    const viewList = _listUpdater('sync', items);
    yo.update(_updaters.sync, viewList);
  });
};

/**
 * @function stockCurrentTab
 * @param {object} tab
 */
function stockCurrentTab(tab) {
  /*
      if (BG.currentTab === 'items-local') {
        if (!BG.utils.isDuplicated(tab.url)) {
          stockItems.append(tab);
        } else {
          BG.notifications.error();
        }
      } else { // === "items-sync"
        stockItems.appendSync(tab);
      }
  */
}

/**
 * @function openSelectedItem
 * @param {object} item
 */
function openSelectedItem(item) {
  // TODO
}

$(function() {
  BG.utils.undefinedResolver();

  /* ***********
   *    Body
   * ***********/

  const $body = $('body');
  const fontSize = localStorage.getItem(BG.OPTIONS.FONT_SIZE);

  $body.css('font-size', `${fontSize}em`);
  $body.width(localStorage.getItem(BG.OPTIONS.POPUP_WIDTH));

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
    chrome.tabs.create({url: 'html/options.html', selected: true});
  });

  /* **********************
   *      Tabs Header
   * **********************/

  const $tabsArea = $('div#tabs');

  $tabsArea.tabs({
    activate(event, ui) {
      BG.currentTab =
        ui.newPanel.selector === '#local' ?
          'items-local' : 'items-sync';
    },
    active: BG.currentTab == 'items-sync' ?
      ITEMS_LOCAL_TAB : ITEMS_SYNC_TAB,
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

  $itemsElement.height(localStorage.getItem(BG.OPTIONS.POPUP_HEIGHT));
  $itemsElement.menu({
    select: itemSelectHandler,
  });
  if (localStorage.getItem(BG.OPTIONS.AUTO_SORT) == 'false') {
    $itemsElement.sortable({
      placeholder: 'ui-state-highlight',
      update: stockItems.orderedSave,
    }).disableSelection();
  }
});

// This is required to use jquery-ui
window.jQuery = $;
