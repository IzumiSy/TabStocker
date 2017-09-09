const NOTIFY_ID = 'default';

const Notifier = {
  error() {
    chrome.notifications.create(NOTIFY_ID, {
      type: 'basic',
      title: 'TabStocker: Error',
      message: 'Tab already stocked',
      iconUrl: 'assets/error.png',
    }, () => {
      console.warn("Tab already stocked")
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
      console.info(`Tab successfully stocked: ${title}`)
    });
  },
};

export default Notifier;
