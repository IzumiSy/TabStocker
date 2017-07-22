const BG = chrome.extension.getBackgroundPage();

const DIRECTION_ASC = '_asc';
const DIRECTION_DESC = '_desc';
const SORT_BY_TITLE = '_bytitle';
const SORT_BY_URL = '_byurl';

//
// Miscellaneous utility functions
//

const i18n =
  (id) => chrome.i18n.getMessage(id);
const convBoolean =
  (data) => (data == 'true' ? true : false);
const undefDefault =
  (undefValue, otherwise) =>
    (undefValue !== undefined ? undefValue : otherwise);

//
// Element selectors
//

const byId = (id) => document.getElementById(id);
const byName = (name) => document.getElementsByName(name);

const elements = {
  saveButton: byId('save-button'),
  cancelButton: byId('cancel-button'),
  popupWidth: byId('popup_width'),
  popupHeight: byId('popup_height'),
  fontSize: byId('font_size'),
  hideFavicon: byId('hide_favicon'),
  noNewTab: byId('no_new_tab'),
  closeOnAdd: byId('close_on_add'),
  removeOpenItem: byId('remove_open_item'),
  autoSort: byId('auto_sort'),
  direction: byName('sort_direction'),
  sortBy: byName('sort_type'),

  captions: {
    popupWidth: byId('caption-popup-width'),
    popupHeight: byId('caption-popup-height'),
    fontSize: byId('caption-font-size'),
    noNewTab: byId('caption-no-new-tab'),
    closeOnAdd: byId('caption-close-on-add'),
    removeOpenItem: byId('caption-remove-open-item'),
    hideFavicon: byId('caption-hide-favicon'),
    autoSort: byId('caption-auto-sort'),
    ascending: byId('caption-ascending'),
    descending: byId('caption-descending'),
    byTitle: byId('caption-by-title'),
    byUrl: byId('caption-by-url'),
  },
};

const get = (id) => localStorage.getItem(id);
const set = (id, data) => localStorage.setItem(id, data);

const storage = {
  popupWidth: get(BG.OPTIONS.POPUP_WIDTH),
  popupHeight: get(BG.OPTIONS.POPUP_HEIGHT),
  fontSize: get(BG.OPTIONS.FONT_SIZE),
  noNewTab: get(BG.OPTIONS.NO_NEW_TAB),
  closeOnAdd: get(BG.OPTIONS.CLOSE_ON_ADD),
  removeOpenItem: get(BG.OPTIONS.REMOVE_OPEN_ITEM),
  hideFavicon: get(BG.OPTIONS.HIDE_FAVICONS),
  autoSort: get(BG.OPTIONS.AUTO_SORT),
  direction: get(BG.OPTIONS.DIRECTION),
  sortBy: get(BG.OPTIONS.SORTBY),

  setter: {
    width: (v) => set(BG.OPTIONS.POPUP_WIDTH, v),
    height: (v) => set(BG.OPTIONS.POPUP_HEIGHT, v),
    fontSize: (v) => set(BG.OPTIONS.FONT_SIZE, v),
    noNewTab: (v) => set(BG.OPTIONS.NO_NEW_TAB, v),
    closeOnAdd: (v) => set(BG.OPTIONS.CLOSE_ON_ADD, v),
    removeOpenItem: (v) => set(BG.OPTIONS.REMOVE_OPEN_ITEM, v),
    hideFavicon: (v) => set(BG.OPTIONS.HIDE_FAVICONS, v),
    autoSort: (v) => set(BG.OPTIONS.AUTO_SORT, v),
    direction: (v) => set(BG.OPTIONS.DIRECTION, v),
    sortBy: (v) => set(BG.OPTIONS.SORTBY, v),
  },
};

/**
 * @function i18nApply
 * @description Apply internationaliztion to elements
 */
function i18nApply() {
  elements.captions.popupWidth.textContent = i18n('extPopupWidth');
  elements.captions.popupHeight.textContent = i18n('extPopupHeight');
  elements.captions.fontSize.textContent = i18n('extFontSize');
  elements.captions.hideFavicon.textContent = i18n('extHideFavicon');
  elements.captions.noNewTab.textContent = i18n('extNoNewTab');
  elements.captions.closeOnAdd.textContent = i18n('extCloseOnAdd');
  elements.captions.removeOpenItem.textContent = i18n('extRemoveOpenItem');
  elements.captions.autoSort.textContent = i18n('extAutoSort');
  elements.captions.ascending.textContent = i18n('extAscending');
  elements.captions.descending.textContent = i18n('extDescending');
  elements.captions.byTitle.textContent = i18n('extByTitle');
  elements.captions.byUrl.textContent = i18n('extByURL');
  elements.saveButton.textContent = i18n('extSaveButton');
  elements.cancelButton.textContent = i18n('extCancelButton');
};

/**
 * @function loadSettings
 * @description The function to load settings from localStorage
 */
function loadSettings() {
  elements.popupWidth.value =
    undefDefault(storage.popupWidth, BG.ui_menu_defaultPopupWidth);
  elements.popupHeight.value =
    undefDefault(storage.popupHeight, BG.ui_menu_defaultPopupHeight);
  elements.fontSize.value =
    undefDefault(storage.fontSize, BG.ui_defaultFontSize);

  elements.noNewTab.checked = convBoolean(storage.noNewTab);
  elements.closeOnAdd.checked = convBoolean(storage.closeOnAdd);
  elements.removeOpenItem.checked = convBoolean(storage.removeOpenItem);
  elements.hideFavicon.checked = convBoolean(storage.hideFavicon);
  elements.autoSort.checked = convBoolean(storage.autoSort);

  switch (storage.direction) {
    case DIRECTION_ASC: elements.direction[0].checked = true; break;
    case DIRECTION_DESC: elements.direction[1].checked = true; break;
    case undefined: break;
  }
  switch (storage.sortBy) {
    case SORT_BY_TITLE: elements.sortBy[0].checked = true; break;
    case SORT_BY_URL: elements.sortBy[1].checked = true; break;
    case undefined: break;
  }
};

/**
 * @function setupOnClickHandlers
 * @description registers click handlers.
 */
function setupOnClickHandlers() {
  elements.saveButton.onclick = function() {
    const fontSize =
      elements.fontSize.value <= 0 ?
      BG.ui_defaultFontSize : elements.fontSize.value;

    let direction;
    if (elements.direction[0].checked) {
      direction = DIRECTION_ASC;
    } else if (elements.direction[1].checked) {
      direction = DIRECTION_DESC;
    }

    let sortby;
    if (elements.sortBy[0].checked) {
      sortby = SORT_BY_TITLE;
    } else if (elements.sortBy[1].checked) {
      sortby = SORT_BY_URL;
    }

    const popupWidth = elements.popupWidth.value;
    if (popupWidth < BG.ui_menu_defaultPopupWidth ||
        popupWidth > BG.ui_menu_maxPopupWidth) {
      alert('The value of Popup width should be set in the range from 250px to 500px');
      return;
    }
    const popupHeight = elements.popupHeight.value;
    if (popupHeight < BG.ui_menu_defaultPopupHeight ||
        popupHeight > BG.ui_menu_maxPopupHeight) {
      alert('The value of Popup height should set in the range from 200px to 530px');
      return;
    }

    storage.setter.width(popupWidth);
    storage.setter.height(popupHeight);
    storage.setter.fontSize(fontSize);
    storage.setter.noNewTab(elements.noNewTab.checked);
    storage.setter.closeOnAdd(elements.closeOnAdd.checked);
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
    document
      .querySelectorAll('.sort_details')
      .forEach((e) => {
        e.disabled = !elements.autoSort.checked;
      });
  };
};

$(function() {
  setupOnClickHandlers();
  i18nApply();
  loadSettings();
});
