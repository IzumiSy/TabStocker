import $ from 'jquery';
import Constants from './constants';
import Prefs from './preference';

//
// Element selectors
//

const byId = (id) => document.getElementById(id);
const byName = (name) => document.getElementsByName(name);

const $saveButton = byId('save-button');
const $cancelButton = byId('cancel-button');
const $popupWidth = byId('popup_width');
const $popupHeight = byId('popup_height');
const $fontSize = byId('font_size');
const $hideFavicon = byId('hide_favicon');
const $noNewTab = byId('no_new_tab');
const $closeOnAdd = byId('close_on_add');
const $removeOpenItem = byId('remove_open_item');
const $autoSort = byId('auto_sort');
const $direction = byName('sort_direction');
const $sortBy = byName('sort_type');

/**
 * @function i18nApply
 * @description Apply internationaliztion to elements
 */
function i18nApply() {
  const i18n =
    (id) => chrome.i18n.getMessage(id);

  $('#caption-popup-width').text(i18n('extPopupWidth'));
  $('#caption-popup-height').text(i18n('extPopupHeight'));
  $('#caption-font-size').text(i18n('extFontSize'));
  $('#caption-hide-favicon').text(i18n('extHideFavicon'));
  $('#caption-no-new-tab').text(i18n('extNoNewTab'));
  $('#caption-close-on-add').text(i18n('extCloseOnAdd'));
  $('#caption-remove-open-item').text(i18n('extRemoveOpenItem'));
  $('#caption-auto-sort').text(i18n('extAutoSort'));
  $('#caption-ascending').text(i18n('extAscending'));
  $('#caption-descending').text(i18n('extDescending'));
  $('#caption-by-title').text(i18n('extByTitle'));
  $('#caption-by-url').text(i18n('extByURL'));
  $('#save-button').text(i18n('extSaveButton'));
  $('#cancel-button').text(i18n('extCancelButton'));
};

/**
 * @function loadSettings
 * @description The function to load settings from localStorage
 */
function loadSettings() {
  $popupWidth.value =
    Prefs.get(Constants.optionKeys.POPUP_WIDTH);
  $popupHeight.value =
    Prefs.get(Constants.optionKeys.POPUP_HEIGHT);
  $fontSize.value =
    Prefs.get(Constants.optionKeys.FONT_SIZE);

  $noNewTab.checked =
    Prefs.get(Constants.optionKeys.NO_NEW_TAB);
  $closeOnAdd.checked =
    Prefs.get(Constants.optionKeys.CLOSE_ON_ADD);
  $removeOpenItem.checked =
    Prefs.get(Constants.optionKeys.REMOVE_OPEN_ITEM);
  $hideFavicon.checked =
    Prefs.get(Constants.optionKeys.HIDE_FAVICONS);
  $autoSort.checked =
    Prefs.get(Constants.optionKeys.AUTO_SORT);

  switch (Prefs.get(Constants.optionKeys.DIRECTION)) {
    case Constants.optionKeys.DIRECTION_WAY.ASC:
      $direction[0].checked = true;
      break;
    case Constants.optionKeys.DIRECTION_WAY.DESC:
      $direction[1].checked = true;
      break;
    case undefined:
      // noop
  }

  switch (Prefs.get(Constants.optionKeys.SORTBY)) {
    case Constants.optionKeys.SORTBY_WAY.TITLE:
      $sortBy[0].checked = true;
      break;
    case Constants.optionKeys.SORTBY_WAY.URL:
      $sortBy[1].checked = true;
      break;
    case undefined:
      // noop
  }
};

/**
 * @function setupOnClickHandlers
 * @description registers click handlers.
 */
function setupOnClickHandlers() {
  $saveButton.onclick = function() {
    const fontSize =
      $fontSize.value <= 0 ?
      Constants.default.fontSize : $fontSize.value;

    let direction;
    if ($direction[0].checked) {
      direction = Constants.optionKeys.DIRECTION_WAY.ASC;
    } else if ($direction[1].checked) {
      direction = Constants.optionKeys.DIRECTION_WAY.DESC;
    }

    let sortby;
    if ($sortBy[0].checked) {
      sortby = Constants.optionKeys.SORTBY_WAY.TITLE;
    } else if ($sortBy[1].checked) {
      sortby = Constants.optionKeys.SORTBY_WAY.URL;
    }

    const popupWidth = $popupWidth.value;
    if (popupWidth < Constants.default.popupWidth ||
        popupWidth > Constants.default.maxPopupWidth) {
      alert('The value of Popup width should be set in the range from 250px to 500px');
      return;
    }
    const popupHeight = $popupHeight.value;
    if (popupHeight < Constants.default.popupHeight ||
        popupHeight > Constants.default.maxPopupHeight) {
      alert('The value of Popup height should set in the range from 200px to 530px');
      return;
    }

    Prefs.set(Constants.optionKeys.POPUP_WIDTH, popupWidth);
    Prefs.set(Constants.optionKeys.POPUP_HEIGHT, popupHeight);
    Prefs.set(Constants.optionKeys.FONT_SIZE, fontSize);
    Prefs.set(Constants.optionKeys.NO_NEW_TAB, $noNewTab.checked);
    Prefs.set(Constants.optionKeys.CLOSE_ON_ADD, $closeOnAdd.checked);
    Prefs.set(Constants.optionKeys.REMOVE_OPEN_ITEM, $removeOpenItem.checked);
    Prefs.set(Constants.optionKeys.HIDE_FAVICONS, $hideFavicon.checked);
    Prefs.set(Constants.optionKeys.AUTO_SORT, $autoSort.checked);
    Prefs.set(Constants.optionKeys.DIRECTION, direction);
    Prefs.set(Constants.optionKeys.SORTBY, sortby);

    window.close();
  };

  $cancelButton.onclick = function() {
    window.close();
  };

  $autoSort.onclick = function() {
    document
      .querySelectorAll('.sort_details')
      .forEach((e) => {
        e.disabled = !$autoSort.checked;
      });
  };
};

$(function() {
  setupOnClickHandlers();
  i18nApply();
  loadSettings();
});
