
// background.js

import Notifier from './notifier';
import Constants from './constants';
import StorageRepository from './storage';

window.Notifier = Notifier;

window.currentTab = null;
window.ITEMS_ID = 'Items';

const eventHandlers = {
  shortcutKey: function(command) {
    if (command == "stock-tab") {
      chrome.tabs.getSelected(window.id, function(tab) {
        if (!utils.isDuplicated(tab.url, "items-local")) {
          Notifier.success(tab.title);

          /*
          storageUpdater.appendItem(tab.title, tab.url, "items-local");
          if (localStorage.getItem(Constants.optionKeys.CLOSE_ON_ADD) == "true") {
            chrome.tabs.remove(tab.id);
          }
          */
        } else {
          Notifier.error();
        }
      });
    }
  },

  contextMenu: function(info, tab) {
    var title, url;
    var r = new XMLHttpRequest();

    r.onreadystatechange = function() {
      eventHandlers.HTTPrequestHandler({
        requestObj: r,
        url: info.linkUrl
      });
    };
    r.open("GET", info.linkUrl, true);
    r.responseType = "document";
    r.send(null);

    console.log("[REQUESTED] " + info.linkUrl);
  },

  HTTPrequestHandler: function(args) {
    var request = args.requestObj;
    if (!request || !request.responseXML) {
      return;
    }

    var GOOGLE_REDIRECTION_SIGN = "window.googleJavaScriptRedirect=1";
    var responseXML = request.responseXML;
    var scripts = responseXML.scripts;
    var meta = responseXML.getElementsByTagName("noscript");

    var title = responseXML.title;
    var url = args.url;

    // If the result of the request is the one returned by Google search,
    // it possible is a redirection to the destination page.
    if (request.readyState == 4 && request.status == 200) {
      if (scripts[0].innerText === GOOGLE_REDIRECTION_SIGN) {
        url = meta[0].innerHTML.substr(43).slice(0, -3);
        request.open("GET", url, true);
        request.send(null);
        return;
      }

      if (!utils.isDuplicated(url, "items-local")) {
        Notifier.success(title);
        // storageUpdater.appendItem(title, url, currentTab);
      } else {
        Notifier.error();
      }
    }
  }
};

window.utils = {
  isDuplicated: function(url) {
    var r = false;
    if (localStorage.getItem(ITEMS_ID).length > 0) {
      JSON.parse(localStorage.getItem(ITEMS_ID)).forEach(function(Item, i) {
      if (Item["url"] === url) {
          r = true;
        }
      });
    }
    return r;
  },

  sorting: function(array) {
    var Items = array;
    var elements = null, r = null;
    var sortby = localStorage.getItem(Constants.optionKeys.SORTBY);
    var direction = localStorage.getItem(Constants.optionKeys.DIRECTION);

    switch (sortby) {
      case "by_title": elements = "title"; break;
      case "by_url": elements = "url"; break;
    }
    Items.sort(function(a, b) {
      switch (direction) {
        case "asc": r = 1; break;
        case "desc": r = -1; break;
      }
      if (a[elements] > b[elements]) return r;
      if (a[elements] < b[elements]) return -r;
      return 0;
    });

    return Items;
  },

  undefinedResolver: function() {
    if (!localStorage.getItem(Constants.optionKeys.POPUP_WIDTH)) {
      localStorage.setItem(Constants.optionKeys.POPUP_WIDTH, Constants.default.popupWidth);
    }
    if (!localStorage.getItem(Constants.optionKeys.POPUP_HEIGHT)) {
      localStorage.setItem(Constants.optionKeys.POPUP_HEIGHT, Constants.default.popupHeight);
    }
    if (!localStorage.getItem(Constants.optionKeys.FONT_SIZE)) {
      localStorage.setItem(Constants.optionKeys.FONT_SIZE, Constants.default.fontSize);
    }
    if (!localStorage.getItem(ITEMS_ID)) {
      localStorage.setItem(ITEMS_ID, []);
    }
  }
};

/*
window.storageUpdater = {
  appendItem: function(title, url, target) {
    var Items = [];

    if (title === undefined || title === null || title === "") {
      title = url;
    }

    if (target === "items-local") {
      if (localStorage.getItem(ITEMS_ID).length > 0) {
        Items = JSON.parse(localStorage.getItem(ITEMS_ID));
      }
      Items.push({ "title": title, "url": url });
      localStorage.setItem(ITEMS_ID, JSON.stringify(Items));
      chrome.browserAction.setBadgeText({text: String(Items.length)});
    }
    else { // === "items-sync"
      chrome.storage.sync.get("items", function(data) {
        storageUpdater.callback_appendSync(title, url, data);
      });
    }
  },

  callback_appendSync: function(title, url, data) {
    if (chrome.runtime.lastError) {
      return;
    }

    var Items = data.items;
    if (!Items || !Items.length) {
      Items = [];
    }
    Items.push({ "title": title, "url": url });
    chrome.storage.sync.set({ "items": Items }, function() {
      if (chrome.runtime.lastError) {
        console.error("Runtime error: chrome.storage.sync in storageUpdater.appendItem");
      }
    });
  },

  eliminateItem: function(title, target) {
    var Items = [];

    if (target === "items-local") {
      Items = JSON.parse(localStorage.getItem(ITEMS_ID));
      for (var i in Items) {
        if (Items[i]["title"] === title) {
          Items.splice(i, 1);
        }
      }
      localStorage.setItem(ITEMS_ID, JSON.stringify(Items));
      chrome.browserAction.setBadgeText({text: String(Items.length)});
    }
    else { // === "items-sync"
      chrome.storage.sync.get("items", function(data) {
        storageUpdater.callback_eliminateSync(title, data);
      });
    }
  },

  callback_eliminateSync: function(title, data) {
    if (chrome.runtime.lastError) {
      return;
    }

    var Items = data.items;
    for (var i in Items) {
      if (Items[i]["title"] === title) {
        Items.splice(i, 1);
      }
    }
    chrome.storage.sync.set({ "items": Items }, function() {
      if (chrome.runtime.lastError) {
        console.error("Runtime error: RemoveDataAndUpdateStorage");
      }
    });
  }
};
*/

chrome.commands.onCommand.addListener(eventHandlers.shortcutKey);
chrome.contextMenus.create({
  "title": "Stock this link",
  "contexts": ["link"],
  "onclick": eventHandlers.contextMenu
});
