
// popup.js

const FAVICON_API = "http://favicon.hatena.ne.jp/?url=";
var BG = chrome.extension.getBackgroundPage();
var removeMode = false;

////////////////////////////////////////////////

function SetItemToMenu(title, url)
{
	var newAnchor = document.createElement("a");
	var newList = document.createElement("li");
	var newDiv = document.createElement("div");
	var newFavicon = document.createElement("img");
	var removeIcon = document.createElement("img");
	var mainMenu = document.getElementById("items");
	
	newFavicon.setAttribute("src", FAVICON_API + url);
	newFavicon.setAttribute("class", "favicon");
	newAnchor.appendChild(newFavicon);
	newAnchor.appendChild(document.createTextNode(title));
	newAnchor.setAttribute("class", "ui-corner-all");
	newAnchor.setAttribute("role", "menuitem");
	newList.appendChild(newAnchor);
	newList.setAttribute("class", "ui-menu-item");
	newList.setAttribute("role", "presentation");
	mainMenu.appendChild(newList);	
}

function RestoreSavedItems()
{
	var Items = [];

	if (localStorage["Items"]) {
		Items = JSON.parse(localStorage["Items"]);
		console.group("<< Previously stocked items >>");
		Items.forEach(function(Item, i) {
			if(Item) {
				console.log(i + " " + Item["title"] + " :: " + Item["url"]);
				SetItemToMenu(Item["title"], Item["url"]);
			}
		});
		console.groupEnd();
		chrome.browserAction.setBadgeText({text: String(Items.length)});
	}
}

function AddItemAndUpdate(item)
{
	SetItemToMenu(item.title, item.url);
	BG.AddDataAndUpdateStorage(item.title, item.url);
	console.group("<< New item added >>");
	console.log("Title: " + item.title);
	console.log("URL: " + item.url);
	console.groupEnd();
}

function RemoveItemAndUpdate(item)
{
	$("#items li:eq(" + item["index"] + ")").remove();
	BG.RemoveDataAndUpdateStorage(item["title"]);
}

function LaunchItemURL(title)
{
	var Items = JSON.parse(localStorage["Items"]);
	for (var i in Items) {
		if (Items[i]["title"] == title) {
			chrome.tabs.create({url: Items[i]["url"], selected: false});
			return;
		}
	}
}

////////////////////////////////////////////////

document.body.onload = function() {
	RestoreSavedItems();
	removeModeOn = false;
	
	$("#add").button();
	$("#options").button();
	$("#remove").button();
	$("#items").menu({
		select: function(event, ui) {
			if (removeMode) {
				RemoveItemAndUpdate({"index": ui.item.index(), "title": ui.item.text()});
			} else {
				LaunchItemURL(ui.item.text());
			}
		}
	});	
};

$("#add").on("click", function() {
	chrome.tabs.getSelected(window.id, function (tab) {
		if (!BG.isDuplicated(tab.url)) {
			AddItemAndUpdate(tab);
		} else {
			alert("ERROR: Any items are not allowed to be duplicated");
		}
	});
});

$("#remove").on("click", function() {
	var removeButton = document.getElementById("remove");
	if (removeButton.checked) {
		$(".ui-button-text").css("color", "red");
		$("#add").button("disable");
	} else {
		$(".ui-button-text").css("color", "black");
		$("#add").button("enable");
	}
	removeMode = ! removeMode;
});

$("#options").on("click", function() {
	console.log("Options");
});
