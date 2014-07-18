
// popup.js

// API url for obtaining favicons
const FAVICON_API = "http://favicon.hatena.ne.jp/?url=";

var BG = chrome.extension.getBackgroundPage();
var removeMode = false;

////////////////////////////////////////////////

function RemoveItemFromMenu(index)
{
	$("#items li:eq(" + index + ")").remove();
}

function SetItemToMenu(title, url)
{
	var newAnchor = document.createElement("a");
	var newList = document.createElement("li");
	var newDiv = document.createElement("div");
	var mainMenu = document.getElementById("items");
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

function RestoreSavedItems()
{
	var Items = [];

	if (localStorage.getItem(BG.ITEMS_ID).length > 0) {
		Items = JSON.parse(localStorage.getItem(BG.ITEMS_ID));
		console.group("<< Previously stocked items >>");
		Items.forEach(function(Item, i) {
			if (Item) {
				console.log(i + " " + Item["title"] + " :: " + Item["url"]);
				SetItemToMenu(Item["title"], Item["url"]);
			}
		});
		console.groupEnd();
		chrome.browserAction.setBadgeText({text: String(Items.length)});
	}
}

function AddItem(item)
{
	SetItemToMenu(item.title, item.url);
	BG.AddDataAndUpdateStorage(item.title, item.url);
}

function RemoveItem(item)
{
	RemoveItemFromMenu(item["index"]);
	BG.RemoveDataAndUpdateStorage(item["title"]);
}

function LaunchItem(title)
{
	var Items = JSON.parse(localStorage.getItem(BG.ITEMS_ID));
	for (var i in Items) {
		if (Items[i]["title"] == title) {
			chrome.tabs.create({url: Items[i]["url"], selected: false});
			return;
		}
	}
}

function SaveReorderedList()
{
	var Items = JSON.parse(localStorage.getItem(BG.ITEMS_ID));
	var listLength = $("li").length;
	var storageLength = Items.length;
	var temps = [];
	var url;

	localStorage.setItem(BG.ITEMS_ID, undefined);

	for (i = 0;i < listLength;i++) {
		title = $("li")[i].textContent;
		url = undefined;
		for (var j in Items) {
			if (Items[j]["title"] == title) {
				url = Items[j]["url"];
				temps.push({"title": title, "url": url});
				break;
			}
		}
	}

	localStorage.setItem(BG.ITEMS_ID, JSON.stringify(temps));
}

////////////////////////////////////////////////

document.body.onload = function() {
	BG.undefinedResolver()
	$("body").css("font-size", localStorage.getItem(BG.OPTION_FONT_SIZE) + "em");
	$("body").width(localStorage.getItem(BG.OPTION_POPUP_WIDTH));
	$("ul").width($("body").width() - 12);
	$("a").width($("body").width() - 12);

	$("#add").button();
	$("#options").button();
	$("#remove").button();

	$("#items").menu({
		select: function(event, ui) {
			if (removeMode) {
				RemoveItem({"index": ui.item.index(), "title": ui.item.text()});
			} else {
				LaunchItem(ui.item.text());
			}
		}
	});
	$("#items").sortable();
	$("#items").disableSelection();
	$("#items").sortable({ update: SaveReorderedList });

	// It should be called after popup width settings were applied on loading
	RestoreSavedItems();

	// Resets a flag for remove mode
	removeModeOn = false;
};

$("#add").on("click", function() {
	chrome.tabs.getSelected(window.id, function (tab) {
		if (!BG.isDuplicated(tab.url)) {
			AddItem(tab);
		} else {
			BG.errorNotification();
		}
	});
});

$("#remove").on("click", function() {
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
});

$("#options").on("click", function() {
	chrome.tabs.create({url: "options.html", selected: true});
});
