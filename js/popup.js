
// popup.js

const FAVICON_API     = "http://favicon.hatena.ne.jp/?url=";
const ITEMS_SYNC_TAB  = 0;
const ITEMS_LOCAL_TAB = 1;

var BG         = chrome.extension.getBackgroundPage();
var removeMode = false;

var stockItems = {
  append: function(item) {
  	this.applyUI.appendItem(item.title, item.url, BG.currentTab);
  	BG.AddDataAndUpdateStorage(item.title, item.url, BG.currentTab);
  },
  
  eliminate: function(item) {
  	this.applyUI.eliminateItem(item["index"], BG.currentTab);
  	BG.RemoveDataAndUpdateStorage(item["title"], BG.currentTab);
  },
  
  launch: function(title) {
    var items;
  
    if (BG.currentTab === "items-local") {
    	items = JSON.parse(localStorage.getItem(BG.ITEMS_ID));
    	stockItems.execute(items, title);
  
    } else { // === "items-sync"
      chrome.storage.sync.get("items", function(data) {
        if (!chrome.runtime.error) {
          var d = data.items;
          if (d !== undefined && data.items.length > 0) {
            items = data.items;
          }
          stockItems.execute(items, title);
        }
      });
    }
  },
  
  execute: function(array, title) {
    for (var i in array) {
    	if (array[i]["title"] == title) {
    	  chrome.tabs.create({url: array[i]["url"], selected: false});
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
  		if (localStorage.getItem(BG.OPTION_AUTO_SORT) == "true") {
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
      if (!chrome.runtime.error) {
        var d = data.items;
        if (d !== undefined && data.items.length > 0) {
          items = data.items;
        }
        if (localStorage.getItem(BG.OPTION_AUTO_SORT) == "true") {
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
      }
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
  
  	if (BG.currentTab == "items-local") {
  	  items = JSON.parse(localStorage.getItem(BG.ITEMS_ID));
  	  localStorage.setItem(BG.ITEMS_ID, JSON.stringify(this.reorder(items)));
  	} else { // == "items-sync"
  	  chrome.storage.sync.get("items", function(data) {
  	    var d = null;
  	    if (!chrome.runtime.error) {
  	      d = data.items;
  	    }
  	    if (d !== null && data.items.length > 0) {
          items = data.items;
        }
        chrome.storage.sync.set({ "items": this.reorder(items) }, function() {
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
    	if (localStorage.getItem(BG.OPTION_HIDE_FAVICONS) != "true") {
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
    	  syncAddition(tab);
  	  }
  	});
  },
  
  btnRemove: function() {
  	var removeButton = document.getElementById("remove");
  	if (removeButton.checked) {
  		$(".ui-button-text").css("color", "red");
  		$(".ui-menu").css("cursor", "pointer");
  		$("#add").button("disable");
  	} else {
  		$(".ui-button-text").css("color", "black");
  		$(".ui-menu").css("cursor", "default");
  		$("#add").button("enable");
  	}
  	removeMode = ! removeMode;
  },
  
  btnOption: function() {
  	chrome.tabs.create({url: "options.html", selected: true});
  }
};

var popupBodyHandlers = {
  itemSelect: function(event, ui) {
		if (removeMode) {
			stockItems.eliminate({"index": ui.item.index(), "title": ui.item.text()});
		} else {
			stockItems.launch(ui.item.text());
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
  	BG.undefinedResolver();
  	$("body").css("font-size", localStorage.getItem(BG.OPTION_FONT_SIZE) + "em");
  	$("body").width(localStorage.getItem(BG.OPTION_POPUP_WIDTH));
  	$("ul").width($("body").width() - 4);
  	$("a.ui-menu-item").width($("body").width() - 12);
  
  	$("#add").button();
  	$("#add").on("click", clickHandlers.btnAdd);
  	$("#remove").button();
  	$("#remove").on("click", clickHandlers.btnRemove);
  	$("#options").button();
  	$("#options").on("click", clickHandlers.btnOption);
  
  	$(".items").menu({ select: popupBodyHandlers.itemSelect });
  	if (localStorage.getItem(BG.OPTION_AUTO_SORT) == "false") {
    	$(".items").sortable({
    	  placeholder: "ui-state-highlight",
    	  update: stockItems.orderedSave
    	}).disableSelection();
  	}
  
  	// Height value loading should be placed just after saved items restoring
  	$(".ui-menu").height(localStorage.getItem(BG.OPTION_POPUP_HEIGHT));
  
  	// Settings for tab
  	var active_tab = ITEMS_SYNC_TAB;
  	if (BG.currentTab == "items-sync") {
  	  active_tab = ITEMS_LOCAL_TAB;
  	}
  	$("#tabs").tabs({
  	  activate: popupBodyHandlers.tabSwitch,
  	  active: active_tab
  	});
  	$(".ui-tabs-nav").width($("body").width() - 13);
  	$("#items-sync").width($("body").width() - 11).css("margin-top", "3px");
  	$("#items-local").width($("body").width() - 11).css("margin-top", "3px");
  
  	stockItems.restore();
  
  	// Resets a flag for remove mode
  	removeModeOn = false;
  }
};

// BG.isDuplicated() cannot be used for sync tab
function syncAddition(tab)
{
  chrome.storage.sync.get("items", function(data) {
    if (!chrome.runtime.lastError) {
      var d = data.items, r = false;
      if (d !== undefined && d.length > 0) {
        d.forEach(function(item, i) {
          if (item["url"] === tab.url) {
            r = true;
          }
        });
        if (r === true) {
          BG.notifications.error();
          return;
        }
      }
      stockItems.append(tab);
    }
  });
}

document.body.onload = popupBodyHandlers.onLoad;
