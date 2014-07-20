
// options.js

var BG = chrome.extension.getBackgroundPage();

document.body.onload = function() {
	document.getElementById("popup_width").value = localStorage.getItem(BG.OPTION_POPUP_WIDTH) != undefined 
		? localStorage.getItem(BG.OPTION_POPUP_WIDTH) : BG.ui_menu_defaultPopupWidth;
	document.getElementById("font_size").value = localStorage.getItem(BG.OPTION_FONT_SIZE) != undefined 
		? localStorage.getItem(BG.OPTION_FONT_SIZE) : BG.ui_defaultFontSize;
	document.getElementById("hide_favicon").checked = localStorage.getItem(BG.OPTION_HIDE_FAVICONS) == "true" ? true : false;
	document.getElementById("auto_sort").checked = localStorage.getItem(BG.OPTION_AUTO_SORT) == "true" ? true : false;
}

document.getElementById("save").onclick = function() {
	var popup_width, font_size, direction, sortby;
	var items;

	popup_width = document.getElementById("popup_width").value;
	if (popup_width < BG.ui_menu_defaultPopupWidth || popup_width > BG.ui_menu_maxPopupWidth) {
		alert("The value of Popup width should be set in the range from 250px to 500px");
		return;
	}
	font_size = document.getElementById("font_size").value;
	if (font_size <= 0) {
		font_size = BG.ui_defaultFontSize;
	}

	localStorage.setItem(BG.OPTION_POPUP_WIDTH, popup_width);
	localStorage.setItem(BG.OPTION_FONT_SIZE, font_size);
	localStorage.setItem(BG.OPTION_HIDE_FAVICONS, document.getElementById("hide_favicon").checked);
	localStorage.setItem(BG.OPTION_AUTO_SORT, document.getElementById("auto_sort").checked);

	items = document.getElementsByName("a");
	for (var i in items) {
		if (items[i].checked) {
			localStorage.setItem(BG.OPTION_DIRECTION, items[i].value);
		}
	}

	items = document.getElementsByName("b");
	for (var i in items) {
		if (items[i].checked) {
			localStorage.setItem(BG.OPTION_SORTBY, items[i].value);
		}
	}

	window.close();
}

document.getElementById("auto_sort").onclick = function() {
	var details = document.getElementsByClassName("sort_details");

	for (var i in details) {
		if (document.getElementById("auto_sort").checked != true) details[i].disabled = true;
		else details[i].disabled = false;
	}
}

document.getElementById("cancel").onclick = function() {
	window.close();
}
