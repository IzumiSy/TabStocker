const NOTIFY_ID = 'default';

const notifications = {
  error() {
    chrome.notifications.create(NOTIFY_ID, {
      type: 'basic',
      title: 'TabStocker: Error',
      message: 'Tab already stocked',
      iconUrl: 'assets/error.png',
    }, () => {
      // TODO 
    });
  },

  success(title) {
    if (!title) {
      console.log('Error: notification.success() needs a page title');
      return;
    }
    chrome.notifications.create(NOTIFY_ID, {
      type: 'basic',
      title: 'TabStocker: Success',
      message: title,
      iconUrl: 'assets/main.png',
    }, () => {
      // TODO
    });
  },
};

export default notifications;
