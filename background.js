
// background.js

const NOTIFY_ID = "default";
var ItemsData = new Array();

function isDuplicated(url)
{
	var r = false;
	ItemsData = JSON.parse(localStorage["Items"]);
	ItemsData.forEach(function(Item, i) {
		if (Item["url"] == url) {
			r = true;
		}
	});
	return r;
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
				// AddItemAndUpdate(tab);
				console.log("stock-tab");
				opts["title"] = "A current tab was stocked";
				opts["message"] = tab.title;
				
				ItemsData.push({ "title": tab.title, "url": tab.url });
				localStorage["Items"] = JSON.stringify(ItemsData);
				chrome.browserAction.setBadgeText({text: String(ItemsData.length)});
				
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
