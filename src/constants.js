export default {
  default: {
    popupWidth: 250,
    popupHeight: 200,
    maxPopupWidth: 500,
    maxPopupHeight: 500,
    fontSize: 0.7,
  },
  optionKeys: {
    POPUP_WIDTH: 'PopupWidth',
    POPUP_HEIGHT: 'PopupHeight',
    FONT_SIZE: 'FontSize',
    HIDE_FAVICONS: 'HideFavicon',
    NO_NEW_TAB: 'NoNewTab',
    CLOSE_ON_ADD: 'CloseOnAdd',
    REMOVE_OPEN_ITEM: 'RemoveOpenItem',
    AUTO_SORT: 'AutomaticSort',

    DIRECTION: 'SortDirection',
    DIRECTION_WAY: {
      ASC: '_asc',
      DESC: '_desc',
    },

    SORTBY: 'SortBy',
    SORTBY_WAY: {
      TITLE: '_bytitle',
      URL: '_byurl',
    },
  },
};
