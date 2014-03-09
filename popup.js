
// popup.js

const FAVICON_API = "http://favicon.hatena.ne.jp/?url=";
var removeMode = false;
var ItemsData = new Array();

function UpdateBadge() {
	chrome.browserAction.setBadgeText({text: String(ItemsData.length)});
}

function UpdateStorage() {
	localStorage["Items"] = JSON.stringify(ItemsData);
}

function SetItemToMenu(title, url) {
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

document.body.onload = function() {
	removeModeOn = false;
	
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
	
	$("#add").button();
	$("#options").button();
	$("#remove").button();
	$("#items").menu({
		select: function(event, ui) {
			if (removeMode) {
				//** Remove an item **//
				$("#items li:eq(" + ui.item.index() + ")").remove();
				for (var i in ItemsData) {
					if (ItemsData[i]["title"] == ui.item.text()) {
						ItemsData.splice(i, 1);
						UpdateStorage();
						UpdateBadge();
						break;
					}
				}
			} else { 
				//** Launch an item **//
				for (var i in ItemsData) {
					if (ItemsData[i]["title"] == ui.item.text()) {
						chrome.tabs.create({url: ItemsData[i]["url"], selected: false});
						break;
					}
				}
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
			SetItemToMenu(tab.title, tab.url);
			ItemsData.push({ "title": tab.title, "url": tab.url });
			UpdateStorage();
			UpdateBadge();
			console.group("<< New item added >>");
			console.log("Title: " + tab.title);
			console.log("URL: " + tab.url);
			console.groupEnd();
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
