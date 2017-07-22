import $ from 'jquery';
import Constants from './constants';
import Prefs from './preference';

const DIRECTION_ASC = '_asc';
const DIRECTION_DESC = '_desc';
const SORT_BY_TITLE = '_bytitle';
const SORT_BY_URL = '_byurl';

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

/**
 * @function i18nApply
 * @description Apply internationaliztion to elements
 */
function i18nApply() {
  const i18n =
    (id) => chrome.i18n.getMessage(id);

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
    Prefs.get(Constants.optionKeys.POPUP_WIDTH);
  elements.popupHeight.value =
    Prefs.get(Constants.optionKeys.POPUP_HEIGHT);
  elements.fontSize.value =
    Prefs.get(Constants.optionKeys.FONT_SIZE);

  elements.noNewTab.checked =
    Prefs.get(Constants.optionKeys.NO_NEW_TAB);
  elements.closeOnAdd.checked =
    Prefs.get(Constants.optionKeys.CLOSE_ON_ADD);
  elements.removeOpenItem.checked =
    Prefs.get(Constants.optionKeys.REMOVE_OPEN_ITEM);
  elements.hideFavicon.checked =
    Prefs.get(Constants.optionKeys.HIDE_FAVICONS);
  elements.autoSort.checked =
    Prefs.get(Constants.optionKeys.AUTO_SORT);

  switch (Prefs.get(Constants.optionKeys.DIRECTION)) {
    case DIRECTION_ASC: elements.direction[0].checked = true; break;
    case DIRECTION_DESC: elements.direction[1].checked = true; break;
    case undefined: break;
  }
  switch (Prefs.get(Constants.optionKeys.SORTBY)) {
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
      Constants.default.fontSize : elements.fontSize.value;

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
    if (popupWidth < Constants.default.popupWidth ||
        popupWidth > Constants.default.maxPopupWidth) {
      alert('The value of Popup width should be set in the range from 250px to 500px');
      return;
    }
    const popupHeight = elements.popupHeight.value;
    if (popupHeight < Constants.default.popupHeight ||
        popupHeight > Constants.default.maxPopupHeight) {
      alert('The value of Popup height should set in the range from 200px to 530px');
      return;
    }

    Prefs.set(Constants.optionKeys.POPUP_WIDTH, popupWidth);
    Prefs.set(Constants.optionKeys.POPUP_HEIGHT, popupHeight);
    Prefs.set(Constants.optionKeys.FONT_SIZE, fontSize);
    Prefs.set(Constants.optionKeys.NO_NEW_TAB, elements.noNewTab.checked);
    Prefs.set(Constants.optionKeys.CLOSE_ON_ADD, elements.closeOnAdd.checked);
    Prefs.set(Constants.optionKeys.REMOVE_OPEN_ITEM, elements.removeOpenItem.checked);
    Prefs.set(Constants.optionKeys.HIDE_FAVICONS, elements.hideFavicon.checked);
    Prefs.set(Constants.optionKeys.AUTO_SORT, elements.autoSort.checked);
    Prefs.set(Constants.optionKeys.DIRECTION, direction);
    Prefs.set(Constants.optionKeys.SORTBY, sortby);

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
