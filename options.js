
// options.js

// When you changed the default value for it in popup.html
// The number below should be fixed manually to have it work well.
const ui_menu_defaultPopupWidth = 250;

// It works once at the first time to avoid blank of popup_width
if (localStorage.PopupWidth == undefined || localStorage.PopupWidth < ui_menu_defaultPopupWidth) {
	localStorage.PopupWidth = ui_menu_defaultPopupWidth;
}

document.body.onload = function() {
	document.getElementById("popup_width").value = localStorage.PopupWidth;
	document.getElementById("hide_favicon").checked = localStorage.HideFavicon == "true" ? true : false;
}

document.getElementById("save").onclick = function() {
	var popup_width = document.getElementById("popup_width").value;

	// To set popup_width to zero, it's ganna be back to the default value.
	if (popup_width > 0 && popup_width < ui_menu_defaultPopupWidth) {
		alert("The value of Popup width should be bigger than 250px");
		return;
	} else if (popup_width == 0) {
		popup_width = ui_menu_defaultPopupWidth;
	}

	localStorage.PopupWidth = popup_width;
	localStorage.HideFavicon = document.getElementById("hide_favicon").checked;
	window.close();
}
