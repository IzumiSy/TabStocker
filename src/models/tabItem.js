import { Record } from 'immutable';

const TabItemRecord = Record({
  title: null,
  url: null,
});

/**
 * Domain Model for TabItem
 */
export default class TabItem extends TabItemRecord {}
