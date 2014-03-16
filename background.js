
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

function errorNotification()
{
	chrome.notifications.create(NOTIFY_ID, {
			type: "basic",
			title: "TabStocker: Error",
			message: "The same titled tab is now already stocked",
			iconUrl: "error.png"
		}, function(id) {
			console.log(opts);
	});
}

chrome.commands.onCommand.addListener(function(command) {
	if (command == "stock-tab") {	
		chrome.tabs.getSelected(window.id, function(tab) {
			if (!isDuplicated(tab.url)) {
				chrome.notifications.create(NOTIFY_ID, {
						type: "basic",
						title: "TabStocker: Success",
						message: tab.title,
						iconUrl: "main.png"
					}, function(id) {
						AddDataAndUpdateStorage(tab.title, tab.url);
						console.log(opts);
				});
			} else {
				errorNotification();
			}
		});
	}
});
