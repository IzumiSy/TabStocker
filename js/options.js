
// options.js

(function(){
  var BG = chrome.extension.getBackgroundPage();

  var consts = {
    direction: {
      ASC:  "asc",
      DESC: "desc"
    },
    sortBy: {
      TITLE: "by_title",
      URL:   "by_url"
    }
  };

  var elements = {
    saveButton:   document.getElementById("save-button"),
    cancelButton: document.getElementById("cancel-button"),
    popupWidth:  document.getElementById("popup_width"),
    popupHeight: document.getElementById("popup_height"),
    fontSize:    document.getElementById("font_size"),
    hideFavicon: document.getElementById("hide_favicon"),
    autoSort:    document.getElementById("auto_sort"),
    direction:   document.getElementsByName("sort_direction"),
    sortBy:      document.getElementsByName("sort_type"),

    captions: {
      popupWidth:  document.getElementById("caption-popup-width"),
      popupHeight: document.getElementById("caption-popup-height"),
      fontSize:    document.getElementById("caption-font-size"),
      hideFavicon: document.getElementById("caption-hide-favicon"),
      autoSort:    document.getElementById("caption-auto-sort"),
      ascending:   document.getElementById("caption-ascending"),
      descending:  document.getElementById("caption-descending"),
      byTitle:     document.getElementById("caption-by-title"),
      byUrl:       document.getElementById("caption-by-url"),
    }
  };

  var storage = {
    popupWidth:  localStorage.getItem(BG.OPTIONS.POPUP_WIDTH),
    popupHeight: localStorage.getItem(BG.OPTIONS.POPUP_HEIGHT),
    fontSize:    localStorage.getItem(BG.OPTIONS.FONT_SIZE),
    hideFavicon: localStorage.getItem(BG.OPTIONS.HIDE_FAVICONS),
    autoSort:    localStorage.getItem(BG.OPTIONS.AUTO_SORT),
    direction:   localStorage.getItem(BG.OPTIONS.DIRECTION),
    sortBy:      localStorage.getItem(BG.OPTIONS.SORTBY),

    setter: {
      width:       function(v) { localStorage.setItem(BG.OPTIONS.POPUP_WIDTH, v);   },
      height:      function(v) { localStorage.setItem(BG.OPTIONS.POPUP_HEIGHT, v);  },
      fontSize:    function(v) { localStorage.setItem(BG.OPTIONS.FONT_SIZE, v);     },
      hideFavicon: function(v) { localStorage.setItem(BG.OPTIONS.HIDE_FAVICONS, v); },
      autoSort:    function(v) { localStorage.setItem(BG.OPTIONS.AUTO_SORT, v);     },
      direction:   function(v) { localStorage.setItem(BG.OPTIONS.DIRECTION, v);     },
      sortBy:      function(v) { localStorage.setItem(BG.OPTIONS.SORTBY, v);        }
    }
  };

  var settingHandlers = {
    setupOnClick: function() {
      console.log("Execute: setupOnClick()");

      elements.saveButton.onclick = function() {
      	var popup_width, popup_height;
      	var font_size, direction, sortby;

      	font_size = elements.fontSize.value <= 0 ? BG.ui_defaultFontSize : elements.fontSize.value;

      	if (elements.direction[0].checked) {
      	  direction = consts.direction.ASC;
      	} else if (elements.direction[1].checked) {
      	  direction = consts.direction.DESC;
      	}

      	if (elements.sortBy[0].checked) {
      	  sortby = consts.sortBy.TITLE;
      	} else if (elements.sortBy[1].checked) {
      	  sortby = consts.sortBy.URL;
      	}

      	popup_width = elements.popupWidth.value;
      	if (popup_width < BG.ui_menu_defaultPopupWidth ||
      	    popup_width > BG.ui_menu_maxPopupWidth) {
      		alert("The value of Popup width should be set in the range from 250px to 500px");
      		return;
      	}
      	popup_height = elements.popupHeight.value;
      	if (popup_height < BG.ui_menu_defaultPopupHeight ||
      	    popup_height > BG.ui_menu_maxPopupHeight) {
      		alert("The value of Popup height should set in the range from 200px to 530px");
      		return;
      	}

      	storage.setter.width(popup_width);
      	storage.setter.height(popup_height);
      	storage.setter.fontSize(font_size);
      	storage.setter.hideFavicon(elements.hideFavicon.checked);
      	storage.setter.autoSort(elements.autoSort.checked);
      	storage.setter.direction(direction);
      	storage.setter.sortBy(sortby);

      	window.close();
      };

      elements.cancelButton.onclick = function() {
    	  window.close();
      };

      elements.autoSort.onclick = function() {
      	var details = document.getElementsByClassName("sort_details");

      	for (var i in details) {
      		if (elements.autoSort.checked !== true) {
      		  details[i].disabled = true;
      		}
      		else details[i].disabled = false;
      	}
      };
    },

    i18nApply: function() {
      console.log("Execute: i18nApply()");

    	elements.captions.popupWidth.textContent  = chrome.i18n.getMessage("extPopupWidth");
    	elements.captions.popupHeight.textContent = chrome.i18n.getMessage("extPopupHeight");
    	elements.captions.fontSize.textContent    = chrome.i18n.getMessage("extFontSize");
    	elements.captions.hideFavicon.textContent = chrome.i18n.getMessage("extHideFavicon");
    	elements.captions.autoSort.textContent    = chrome.i18n.getMessage("extAutoSort");
    	elements.captions.ascending.textContent   = chrome.i18n.getMessage("extAscending");
    	elements.captions.descending.textContent  = chrome.i18n.getMessage("extDescending");
    	elements.captions.byTitle.textContent     = chrome.i18n.getMessage("extByTitle");
    	elements.captions.byUrl.textContent       = chrome.i18n.getMessage("extByURL");

    	elements.saveButton.textContent = chrome.i18n.getMessage("extSaveButton");
    	elements.cancelButton.textContent = chrome.i18n.getMessage("extCancelButton");
    },

    loadSettings: function() {
      console.log("Execute: loadSettings()");

    	elements.popupWidth.value =
    	  storage.popupWidth  !== undefined ? storage.popupWidth : BG.ui_menu_defaultPopupWidth;
    	elements.popupHeight.value =
    	  storage.popupHeight !== undefined ? storage.popupHeight : BG.ui_menu_defaultPopupHeight;
    	elements.fontSize.value =
    	  storage.fontSize    !== undefined ? storage.fontSize : BG.ui_defaultFontSize;
    	elements.hideFavicon.checked =
    	  storage.hideFavicon  == "true" ? true : false;
    	elements.autoSort.checked =
    	  storage.autoSort     == "true" ? true : false;

    	switch (storage.direction) {
    		case consts.direction.ASC:  elements.direction[0].checked = true; break;
    		case consts.direction.DESC: elements.direction[1].checked = true; break;
    		case undefined: break;
    	}
    	switch (storage.sortBy) {
    		case consts.sortBy.TITLE: elements.sortBy[0].checked = true; break;
    		case consts.sortBy.URL:   elements.sortBy[1].checked = true; break;
    		case undefined: break;
    	}

    	console.log(storage);
    }
  };

  document.body.onload = function() {
    settingHandlers.setupOnClick();
    settingHandlers.i18nApply();
    settingHandlers.loadSettings();
  };
})();
