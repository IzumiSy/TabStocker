import yo from 'yo-yo';
import Prefs from '../preference';
import Constants from '../constants';
import ListItem from './listItem';

/**
 * View-Model for ItemList
 */
export default class ItemList {
  /**
   * Creates an instance
   * @param {object} args
   */
  constructor(args) {
    this.target = args.target || Constants.viewType.LOCAL;
    this.items = args.items || [];
  }

  /**
   * @function getDOM
   * @return {object} yo-yo object
   */
  getDOM() {
    const popupHeight = Prefs.get(Constants.optionKeys.POPUP_HEIGHT);

    return yo`
      <ul id="items-${this.target}" role="menu" tabindex="0"
        class="items ui-menu ui-widget ui-widget-content"
        style="height: ${popupHeight}px;">
        ${this.items.map((item) => ListItem.fromModel(item).getDOM()).toArray()}
      </ul>
    `;
  }
}

