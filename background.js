
// background.js

const NOTIFY_ID = "default";

function isDuplicated(url)
{
	var r = false;
	JSON.parse(localStorage["Items"]).forEach(function(Item, i) {
		if (Item["url"] == url) {
			r = true;
		}
	});
	return r;
}

function AddDataAndUpdateStorage(title, url)
{
	var Items = JSON.parse(localStorage["Items"]);
	Items.push({ "title": title, "url": url });
	localStorage["Items"] = JSON.stringify(Items);
	chrome.browserAction.setBadgeText({text: String(Items.length)});
}

function RemoveDataAndUpdateStorage(title)
{
	var Items = JSON.parse(localStorage["Items"]);
	for (var i in Items) {
		if (Items[i]["title"] == title) {
			Items.splice(i, 1);
		}
	}
	localStorage["Items"] = JSON.stringify(Items);
	chrome.browserAction.setBadgeText({text: String(Items.length)});
}

chrome.commands.onCommand.addListener(function(command) {
	var opts = {
		type: "basic",
		title: "xxx",
		message: "xxx",
		iconUrl: "main.png"
	}

	if (command == "stock-tab") {	
		chrome.tabs.getSelected(window.id, function(tab) {
			if (!isDuplicated(tab.url)) {
				opts["title"] = "A current tab was stocked";
				opts["message"] = tab.title;
				AddDataAndUpdateStorage(tab.title, tab.url);
			} else {
				opts["title"] = "Error";
				opts["message"] = "Any items are not allowed to be duplicated";
			}
			chrome.notifications.create(NOTIFY_ID, opts, function(id) {
				console.log(opts);
			});
		});
	}
});
