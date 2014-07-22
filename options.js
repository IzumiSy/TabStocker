
// options.js

var BG = chrome.extension.getBackgroundPage();

document.body.onload = function() {
	document.getElementById("popup_width").value = localStorage.getItem(BG.OPTION_POPUP_WIDTH) != undefined 
		? localStorage.getItem(BG.OPTION_POPUP_WIDTH) : BG.ui_menu_defaultPopupWidth;
	document.getElementById("popup_height").value = localStorage.getItem(BG.OPTION_POPUP_HEIGHT) != undefined
		? localStorage.getItem(BG.OPTION_POPUP_HEIGHT) : BG.ui_menu_defaultPopupHeight;
	document.getElementById("font_size").value = localStorage.getItem(BG.OPTION_FONT_SIZE) != undefined 
		? localStorage.getItem(BG.OPTION_FONT_SIZE) : BG.ui_defaultFontSize;
	document.getElementById("hide_favicon").checked = localStorage.getItem(BG.OPTION_HIDE_FAVICONS) == "true" ? true : false;
	document.getElementById("auto_sort").checked = localStorage.getItem(BG.OPTION_AUTO_SORT) == "true" ? true : false;

	switch (localStorage.getItem(BG.OPTION_DIRECTION)) {
		case "asc": document.getElementsByName("a")[0].checked = true; break;
		case "desc": document.getElementsByName("a")[1].checked = true; break;
		case undefined: break;
	}
	switch (localStorage.getItem(BG.OPTION_SORTBY)) {
		case "by_title": document.getElementsByName("b")[0].checked = true; break;
		case "by_url": document.getElementsByName("b")[1].checked = true; break;
		case undefined: break;
	}
}

document.getElementById("save").onclick = function() {
	var popup_width, popup_height, font_size, direction, sortby;
	var items;

	popup_width = document.getElementById("popup_width").value;
	if (popup_width < BG.ui_menu_defaultPopupWidth || popup_width > BG.ui_menu_maxPopupWidth) {
		alert("The value of Popup width should be set in the range from 250px to 500px");
		return;
	}
	popup_height = document.getElementById("popup_height").value;
	if (popup_height < BG.ui_menu_defaultPopupHeight || popup_height > BG.ui_menu_maxPopupHeight) {
		alert("The value of Popup height should set in the range from 200px to 530px");
		return;
	}
	font_size = document.getElementById("font_size").value;
	if (font_size <= 0) {
		font_size = BG.ui_defaultFontSize;
	}

	localStorage.setItem(BG.OPTION_POPUP_WIDTH, popup_width);
	localStorage.setItem(BG.OPTION_POPUP_HEIGHT, popup_height);
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
