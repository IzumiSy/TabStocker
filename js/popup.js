
// popup.js

(function(){
  const FAVICON_API     = "http://favicon.hatena.ne.jp/?url=";
  const ITEMS_SYNC_TAB  = 0;
  const ITEMS_LOCAL_TAB = 1;

  var BG         = chrome.extension.getBackgroundPage();
  var removeMode = false;

  // DOMs
  var body      = $("body");
  var addBtn    = $("#add");
  var removeBtn = $("#remove");
  var optsBtn   = $("#options");
  var tabsArea  = $("div#tabs");
  
  var itemsElm    = $(".items");
  var itemLink    = $("li > a.ui-menu-item");
  var tabNav      = $(".ui-tabs-nav");
  var syncTabElm  = $("#items-sync");
  var localTabElm = $("#items-local");
  var localItem   = $("#local li");
  var syncItem    = $("#sync li");

  var stockItems = {
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
        if (items !== undefined && items.length > 0) {
          items.forEach(function(item, i) {
            if (item["url"] === tab.url) {
              BG.notifications.error();
              return;
            }
          });
        }
        stockItems.append(tab);
      });
    },

    eliminate: function(item) {
      this.applyUI.eliminateItem(item["index"], BG.currentTab);
      BG.storageUpdater.eliminateItem(item["title"], BG.currentTab);
    },

    launch: function(title) {
      var items;

      if (BG.currentTab === "items-local") {
        items = JSON.parse(localStorage.getItem(BG.ITEMS_ID));
        stockItems.execute(items, title);

      } else { // === "items-sync"
        chrome.storage.sync.get("items", function(data) {
          if (chrome.runtime.lastError) {
            return;
          }
          var d = data.items;
          if (d !== undefined && data.items.length > 0) {
            items = data.items;
          }
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
            chrome.tabs.query({ active: true }, queryCallback);
          } else {
            chrome.tabs.create({url: array[i]["url"], selected: false});  
          }
          break;
        }
      }
    },

    restore: function() {
      var items = [];
      var data = localStorage.getItem(BG.ITEMS_ID);

      // Local items
      if (data !== undefined && data.length > 0) {
        items = JSON.parse(data);
        if (localStorage.getItem(BG.OPTIONS.AUTO_SORT) == "true") {
          items = BG.utils.sorting(items);
        }
        console.group("<< Previously stocked items (Local) >>");
        items.forEach(function(item, i) {
          if (item) {
            console.log(i + " " + item["title"] + " :: " + item["url"]);
            stockItems.applyUI.appendItem(item["title"], item["url"], "items-local");
          }
        });
        console.groupEnd();
        chrome.browserAction.setBadgeText({text: String(items.length)});
      }

      // Sync Items
      items = [];
      chrome.storage.sync.get("items", function(data) {
        if (chrome.runtime.lastError) {
          return;
        }
        var d = data.items;
        if (d !== undefined && data.items.length > 0) {
          items = data.items;
        }
        if (localStorage.getItem(BG.OPTIONS.AUTO_SORT) == "true") {
          items = BG.utils.sorting(items);
        }
        console.group("<< Previously stocked items (Sync) >>");
        items.forEach(function(item, i) {
          if (item) {
            console.log(i + " " + item["title"] + " :: " + item["url"]);
            stockItems.applyUI.appendItem(item["title"], item["url"], "items-sync");
          }
        });
        console.groupEnd();
      });
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
          if (chrome.runtime.lastError ||
              data.items !== null  ||
             !data.items.length) {
            return;
          }
          items = data.items;
          orderedItems = stockItems.reorder(items);
          chrome.storage.sync.set({ "items": orderdItems }, function() {
            console.log("Reordered: items-sync");
          });
        });
      }
    },

    applyUI: {
      eliminateItem: function(index, tab) {
        $("#" + tab + " li:eq(" + index + ")").hide('slide', {direction: 'right'}, 200);
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
          console.log(tab.url);
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
      console.log("Tab switched: " + BG.currentTab);
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

      stockItems.restore();

      // Resets a flag for remove mode
      removeModeOn = false;
    }
  };

  document.body.onload = popupBodyHandlers.onLoad;
})();
