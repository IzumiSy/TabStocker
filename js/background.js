
// background.js

const ui_menu_defaultPopupWidth = 250;
const ui_menu_defaultPopupHeight = 200;
const ui_menu_maxPopupWidth = 500;
const ui_menu_maxPopupHeight = 500;
const ui_defaultFontSize = 0.7;

const NOTIFY_ID = "default";
const ITEMS_ID = "Items";
const OPTION_POPUP_WIDTH = "PopupWidth";
const OPTION_POPUP_HEIGHT = "PopupHeight";
const OPTION_FONT_SIZE = "FontSize";
const OPTION_HIDE_FAVICONS = "HideFavicon";
const OPTION_AUTO_SORT = "AutomaticSort";
const OPTION_DIRECTION = "SortDirection";
const OPTION_SORTBY = "SortBy";

var currentTab = "items-local";

function undefinedResolver()
{
	if (localStorage.getItem(OPTION_POPUP_WIDTH) === undefined) {
		localStorage.setItem(OPTION_POPUP_WIDTH, ui_menu_defaultPopupWidth);
	}
	if (localStorage.getItem(OPTION_POPUP_HEIGHT) === undefined) {
		localStorage.setItem(OPTION_POPUP_HEIGHT, ui_menu_defaultPopupHeight);
	}
	if (localStorage.getItem(OPTION_FONT_SIZE) === undefined) {
		localStorage.setItem(OPTION_FONT_SIZE, ui_defaultFontSize);
	}
	if (localStorage.getItem(ITEMS_ID) === undefined) {
		localStorage.setItem(ITEMS_ID, []);
	}
}

function isDuplicated(url)
{
	var r = false;
	if (localStorage.getItem(ITEMS_ID).length > 0) {
		JSON.parse(localStorage.getItem(ITEMS_ID)).forEach(function(Item, i) {
		if (Item["url"] === url) {
				r = true;
			}
		});
	}
  return r;
}

function sorting(array)
{
  var Items = array;
  var elements = null, r = null;
	var sortby = localStorage.getItem(OPTION_SORTBY);
	var direction = localStorage.getItem(OPTION_DIRECTION);

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
}

function AddDataAndUpdateStorage(title, url, target)
{
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
	    if (!chrome.runtime.lastError) {
	      var d = data.items;
        if (d !== undefined && d.length > 0) {
          Items = data.items;
        }
        Items.push({ "title": title, "url": url });
    	  chrome.storage.sync.set({ "items": Items }, function() {
          if (chrome.runtime.lastError) {
            console.error("Runtime error: AddDataAndUpdateStorage");
          }
        });
	    }
	  });
	}
}

function RemoveDataAndUpdateStorage(title, target)
{
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
      if (!chrome.runtime.error) {
        Items = data.items;
        for (var i in Items) {
          if (Items[i]["title"] === title) {
            Items.splice(i, 1);
          }
        }
    	  chrome.storage.sync.set({ "items": Items }, function() {
          if (chrome.runtime.error) {
            console.error("Runtime error: RemoveDataAndUpdateStorage");
          }
        });
      }
    });
  }
}

function errorNotification()
{
	chrome.notifications.create(NOTIFY_ID, {
		type: "basic",
		title: "TabStocker: Error",
		message: "The same titled tab is now already stocked",
		iconUrl: "assets/error.png"
	}, function(){});
}

function successNotification(title)
{
  chrome.notifications.create(NOTIFY_ID, {
  	type: "basic",
  	title: "TabStocker: Success",
  	message: title,
  	iconUrl: "assets/main.png"
  }, function(){});
}

chrome.commands.onCommand.addListener(function(command) {
	if (command == "stock-tab") {
		chrome.tabs.getSelected(window.id, function(tab) {
			if (!isDuplicated(tab.url, "items-local")) {
        successNotification(tab.title);
        AddDataAndUpdateStorage(tab.title, tab.url, currentTab);
			} else {
				errorNotification();
			}
		});
	}
});

chrome.contextMenus.create({
  "title": "Stock this link",
  "contexts": ["link"],
  "onclick": function(info, tab) {
    var title, url;
    var r = new XMLHttpRequest();

    r.onreadystatechange = handleResponse;
    r.open("GET", info.linkUrl, true);
    r.responseType = "document";
    r.send(null);

  	function handleResponse() {
      if ((r.readyState == 4) && (r.status == 200)) {
        title = r.responseXML.title;
        url = info.linkUrl;

        // Deal with redirection of Google search result
        if (r.responseXML.scripts[0].innerText === "window.googleJavaScriptRedirect=1") {
          var meta = r.responseXML.getElementsByTagName("noscript");
          url = meta[0].innerHTML.substr(43).slice(0, -3);
          r.open("GET", url, true);
          r.send(null);
          return;
        }

        if (!isDuplicated(url, "items-local")) {
          successNotification(title);
          AddDataAndUpdateStorage(title, url, currentTab);
        } else {
          errorNotification();
        }
      }
    }

    console.log("[REQUESTED] " + info.linkUrl);
  }
});
