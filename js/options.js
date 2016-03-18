
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

  //
  // Miscellaneous utility functions
  //

  var i18n = function(id) {
    return chrome.i18n.getMessage(id);
  };

  var convBoolean = function(data) {
    return data == "true" ? true : false;
  };

  var undefDefault = function(undefValue, otherwise) {
    return undefValue !== undefined ? undefValue : otherwise;
  };

  var elm = {
    id: function(id) {
      return document.getElementById(id);
    },

    name: function(name) {
      return document.getElementsByName(name);
    }
  };

  var data = {
    s: function(id, data) {
      localStorage.setItem(id, data);
    },

    g: function(id) {
      return localStorage.getItem(id);
    }
  };

  //
  // Element selectors
  //

  var elements = {
    saveButton:     elm.id("save-button"),
    cancelButton:   elm.id("cancel-button"),
    popupWidth:     elm.id("popup_width"),
    popupHeight:    elm.id("popup_height"),
    fontSize:       elm.id("font_size"),
    hideFavicon:    elm.id("hide_favicon"),
    noNewTab:       elm.id("no_new_tab"),
    removeOpenItem: elm.id("remove_open_item"),
    autoSort:       elm.id("auto_sort"),
    direction:      elm.name("sort_direction"),
    sortBy:         elm.name("sort_type"),

    captions: {
      popupWidth:     elm.id("caption-popup-width"),
      popupHeight:    elm.id("caption-popup-height"),
      fontSize:       elm.id("caption-font-size"),
      noNewTab:       elm.id("caption-no-new-tab"),
      removeOpenItem: elm.id("caption-remove-open-item"),
      hideFavicon:    elm.id("caption-hide-favicon"),
      autoSort:       elm.id("caption-auto-sort"),
      ascending:      elm.id("caption-ascending"),
      descending:     elm.id("caption-descending"),
      byTitle:        elm.id("caption-by-title"),
      byUrl:          elm.id("caption-by-url"),
    }
  };

  console.log(elements);

  var storage = {
    popupWidth:     data.g(BG.OPTIONS.POPUP_WIDTH),
    popupHeight:    data.g(BG.OPTIONS.POPUP_HEIGHT),
    fontSize:       data.g(BG.OPTIONS.FONT_SIZE),
    noNewTab:       data.g(BG.OPTIONS.NO_NEW_TAB),
    removeOpenItem: data.g(BG.OPTIONS.REMOVE_OPEN_ITEM),
    hideFavicon:    data.g(BG.OPTIONS.HIDE_FAVICONS),
    autoSort:       data.g(BG.OPTIONS.AUTO_SORT),
    direction:      data.g(BG.OPTIONS.DIRECTION),
    sortBy:         data.g(BG.OPTIONS.SORTBY),

    setter: {
      width:          function(v) { data.s(BG.OPTIONS.POPUP_WIDTH, v);      },
      height:         function(v) { data.s(BG.OPTIONS.POPUP_HEIGHT, v);     },
      fontSize:       function(v) { data.s(BG.OPTIONS.FONT_SIZE, v);        },
      noNewTab:       function(v) { data.s(BG.OPTIONS.NO_NEW_TAB, v);       },
      removeOpenItem: function(v) { data.s(BG.OPTIONS.REMOVE_OPEN_ITEM, v); },
      hideFavicon:    function(v) { data.s(BG.OPTIONS.HIDE_FAVICONS, v);    },
      autoSort:       function(v) { data.s(BG.OPTIONS.AUTO_SORT, v);        },
      direction:      function(v) { data.s(BG.OPTIONS.DIRECTION, v);        },
      sortBy:         function(v) { data.s(BG.OPTIONS.SORTBY, v);           }
    }
  };

  //
  // Handler functions
  //

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
        storage.setter.noNewTab(elements.noNewTab.checked);
        storage.setter.removeOpenItem(elements.removeOpenItem.checked);
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

      elements.captions.popupWidth.textContent     = i18n("extPopupWidth");
      elements.captions.popupHeight.textContent    = i18n("extPopupHeight");
      elements.captions.fontSize.textContent       = i18n("extFontSize");
      elements.captions.hideFavicon.textContent    = i18n("extHideFavicon");
      elements.captions.noNewTab.textContent       = i18n("extNoNewTab");
      elements.captions.removeOpenItem.textContent = i18n("extRemoveOpenItem");
      elements.captions.autoSort.textContent       = i18n("extAutoSort");
      elements.captions.ascending.textContent      = i18n("extAscending");
      elements.captions.descending.textContent     = i18n("extDescending");
      elements.captions.byTitle.textContent        = i18n("extByTitle");
      elements.captions.byUrl.textContent          = i18n("extByURL");

      elements.saveButton.textContent =   i18n("extSaveButton");
      elements.cancelButton.textContent = i18n("extCancelButton");
    },

    loadSettings: function() {
      console.log("Execute: loadSettings()");

      elements.popupWidth.value =  undefDefault(storage.popupWidth, BG.ui_menu_defaultPopupWidth);
      elements.popupHeight.value = undefDefault(storage.popupHeight, BG.ui_menu_defaultPopupHeight);
      elements.fontSize.value =    undefDefault(storage.fontSize, BG.ui_defaultFontSize);

      elements.noNewTab.checked =       convBoolean(storage.noNewTab);
      elements.removeOpenItem.checked = convBoolean(storage.removeOpenItem);
      elements.hideFavicon.checked =    convBoolean(storage.hideFavicon);
      elements.autoSort.checked =       convBoolean(storage.autoSort);

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
