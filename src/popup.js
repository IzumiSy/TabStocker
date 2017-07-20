import $ from 'jquery';

//
// popup.js
//


const FAVICON_API = 'http://favicon.hatena.ne.jp/?url=';
const ITEMS_SYNC_TAB = 0;
const ITEMS_LOCAL_TAB = 1;

const BG = chrome.extension.getBackgroundPage();
var removeMode = false;

// DOMs
const body = $('body');
const addBtn = $('#add');
const removeBtn = $('#remove');
const optsBtn= $('#options');
const tabsArea = $('div#tabs');

const itemsElm = $('.items');
const itemLink = $('li > a.ui-menu-item');
const tabNav = $('.ui-tabs-nav');
const syncTabElm = $('#items-sync');
const localTabElm = $('#items-local');
const localItem = $('#local li');
const syncItem = $('#sync li');

const isArrayValid = function(n) {
  return (n !== null && n !== undefined || n.length > 0);
};

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

  restore: {
    localItems: function() {
      var items = [];
      var data = localStorage.getItem(BG.ITEMS_ID);
      var isSortOn = (localStorage.getItem(BG.OPTIONS.AUTO_SORT) == "true");

      if (!isArrayValid(data)) {
        return;
      }

      items = JSON.parse(data);
      items = isSortOn ? BG.utils.sorting(items) : items;

      items.forEach(function(item, i) {
        if (!item) return;
        stockItems.applyUI.appendItem(item["title"], item["url"], "items-local");
      });

      chrome.browserAction.setBadgeText({text: String(items.length)});
    },

    syncItems: function() {
      var isSortOn = (localStorage.getItem(BG.OPTIONS.AUTO_SORT) == "true");

      chrome.storage.sync.get("items", function(data) {
        var items = [];

        if (chrome.runtime.lastError || !isArrayValid(data.items)) {
          return;
        }

        items = isSortOn ? BG.utils.sorting(data.items) : data.items;

        items.forEach(function(item, i) {
          if (!item) return;
          stockItems.applyUI.appendItem(item["title"], item["url"], "items-sync");
        });
      });
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

  applyUI: {
    eliminateItem: function(index, tab) {
      $("#" + tab + " li:eq(" + index + ")").hide(100, function() {
        item.remove();
      });
    },

    appendItem: function(title, url, tab) {
      var newAnchor = document.createElement("a");
      var newList = document.createElement("li");
      var newDiv = document.createElement("div");
      var mainMenu = document.getElementById(tab);
      var newFavicon;

      // For favicon hide option
      if (localStorage.getItem(BG.OPTIONS.HIDE_FAVICONS) != "true") {
        newFavicon = document.createElement("img");
        newFavicon.setAttribute("src", FAVICON_API + url);
        newFavicon.setAttribute("class", "favicon");
        newAnchor.appendChild(newFavicon);
      }

      newAnchor.appendChild(document.createTextNode(title));
      newAnchor.setAttribute("class", "ui-corner-all");
      newAnchor.setAttribute("role", "menuitem");
      newAnchor.setAttribute("style", "width: " + $("body").width() - 12 + "px");
      newList.appendChild(newAnchor);
      newList.setAttribute("class", "ui-menu-item");
      newList.setAttribute("role", "presentation");
      newList.setAttribute("style", "width: " + $("body").width() - 12 + "px");
      mainMenu.appendChild(newList);
    }
  }
};

var clickHandlers = {
  btnAdd: function() {
    chrome.tabs.getSelected(window.id, function (tab) {
      if (BG.currentTab === "items-local") {
        if (!BG.utils.isDuplicated(tab.url)) {
          stockItems.append(tab);
        } else {
          BG.notifications.error();
        }
      } else { // === "items-sync"
        stockItems.appendSync(tab);
      }
    });
  },

  btnRemove: function() {
    var removeButton = removeBtn;
    if (removeButton.checked) {
      addBtn.button("disable");
    } else {
      addBtn.button("enable");
    }
    $("ul.items li.ui-menu-item a").toggleClass("delete-mode");
    removeMode = ! removeMode;
  },

  btnOption: function() {
    chrome.tabs.create({url: "html/options.html", selected: true});
  }
};

var popupBodyHandlers = {
  itemSelect: function(event, ui) {
    removeOptions = {
      "index": ui.item.index(),
      "title": ui.item.text()
    };
    if (removeMode) {
      stockItems.eliminate(removeOptions);
    } else {
      stockItems.launch(ui.item.text());
      if (localStorage.getItem(BG.OPTIONS.REMOVE_OPEN_ITEM) == "true") {
        stockItems.eliminate(removeOptions);
      }
    }
  },

  tabSwitch: function(event, ui) {
    if (ui.newPanel.selector === "#local") {
      BG.currentTab = "items-local";
    } else { // === "#sync"
      BG.currentTab = "items-sync";
    }
  },

  onLoad: function() {
    BG.utils.undefinedResolver();

    body.css("font-size", localStorage.getItem(BG.OPTIONS.FONT_SIZE) + "em");
    body.width(localStorage.getItem(BG.OPTIONS.POPUP_WIDTH));
    itemsElm.width(body.width() - 4);
    itemLink.width(body.width() - 12);

    addBtn.button();
    addBtn.on("click", clickHandlers.btnAdd);
    removeBtn.button();
    removeBtn.on("click", clickHandlers.btnRemove);
    optsBtn.button();
    optsBtn.on("click", clickHandlers.btnOption);

    itemsElm.menu({ select: popupBodyHandlers.itemSelect });
    if (localStorage.getItem(BG.OPTIONS.AUTO_SORT) == "false") {
      itemsElm.sortable({
        placeholder: "ui-state-highlight",
        update: stockItems.orderedSave
      }).disableSelection();
    }

    // Height value loading should be placed just after saved items restoring
    itemsElm.height(localStorage.getItem(BG.OPTIONS.POPUP_HEIGHT));

    // Settings for tab
    var active_tab = ITEMS_SYNC_TAB;
    if (BG.currentTab == "items-sync") {
      active_tab = ITEMS_LOCAL_TAB;
    }
    tabsArea.tabs({
      activate: popupBodyHandlers.tabSwitch,
      active: active_tab
    });
    tabNav.width(body.width() - 13);
    syncTabElm.width(body.width() - 11).css("margin-top", "3px");
    localTabElm.width(body.width() - 11).css("margin-top", "3px");

    // Restore items
    stockItems.restore.localItems();
    stockItems.restore.syncItems();

    // Resets a flag for remove mode
    removeModeOn = false;
  }
};

$(function() {
  popupBodyHandlers.onLoad();
});

// This is required to use jquery-ui
global.jQuery = $;
