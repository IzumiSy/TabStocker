
// popup.js

const FAVICON_API = "http://favicon.hatena.ne.jp/?url=";
var removeMode = false;
var ItemsData = new Array();

////////////////////////////////////////////////

function UpdateBadge()
{
	chrome.browserAction.setBadgeText({text: String(ItemsData.length)});
}

function UpdateStorage()
{
	localStorage["Items"] = JSON.stringify(ItemsData);
}

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
	ItemsData = [];

	if (localStorage["Items"]) {
		ItemsData = JSON.parse(localStorage["Items"]);
		console.group("<< Previously stocked items >>");
		ItemsData.forEach(function(Item, i) {
			if(Item) {
				console.log(i + " " + Item["title"] + " :: " + Item["url"]);
				SetItemToMenu(Item["title"], Item["url"]);
			}
		});
		console.groupEnd();
		UpdateBadge();
	}
}

function AddItemAndUpdate(item)
{
	SetItemToMenu(item.title, item.url);
	ItemsData.push({ "title": item.title, "url": item.url });
	UpdateStorage();
	UpdateBadge();

	console.group("<< New item added >>");
	console.log("Title: " + item.title);
	console.log("URL: " + item.url);
	console.groupEnd();
}

function RemoveItemAndUpdate(item)
{
	var index = item["index"];
	var title = item["title"];

	$("#items li:eq(" + index + ")").remove();
	for (var i in ItemsData) {
		if (ItemsData[i]["title"] == title) {
			ItemsData.splice(i, 1);
			UpdateStorage();
			UpdateBadge();
			return;
		}
	}
}

function LaunchItemURL(title)
{
	for (var i in ItemsData) {
		if (ItemsData[i]["title"] == title) {
			chrome.tabs.create({url: ItemsData[i]["url"], selected: false});
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
	var Duplication = false;

	chrome.tabs.getSelected(window.id, function (tab) {
		ItemsData.forEach(function(Item, i) {
			if (Item["url"] == tab.url) {
				Duplication = true;
			}
		});
		if (!Duplication) {
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
