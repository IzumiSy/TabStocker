
// background.js

import Notifier from './notifier';
import Constants from './constants';
import Prefs from './preference';

window.Notifier = Notifier;
window.currentTab = null;

const eventHandlers = {
  HTTPrequestHandler: function(args) {
    /*
    var request = args.requestObj;
    if (!request || !request.responseXML) {
      return;
    }

    var GOOGLE_REDIRECTION_SIGN = "window.googleJavaScriptRedirect=1";
    var responseXML = request.responseXML;
    var scripts = responseXML.scripts;
    var meta = responseXML.getElementsByTagName("noscript");

    var title = responseXML.title;
    var url = args.url;

    // If the result of the request is the one returned by Google search,
    // it possible is a redirection to the destination page.
    if (request.readyState == 4 && request.status == 200) {
      if (scripts[0].innerText === GOOGLE_REDIRECTION_SIGN) {
        url = meta[0].innerHTML.substr(43).slice(0, -3);
        request.open("GET", url, true);
        request.send(null);
        return;
      }

      if (!utils.isDuplicated(url, "items-local")) {
        Notifier.success(title);
        // storageUpdater.appendItem(title, url, currentTab);
      } else {
        Notifier.error();
      }
    }
    */
  },
};

window.utils = {
  undefinedResolver: function() {
    Prefs.set(Constants.optionKeys.POPUP_WIDTH,
      Prefs.get(Constants.optionKeys.POPUP_WIDTH));
    Prefs.set(Constants.optionKeys.POPUP_HEIGHT,
      Prefs.get(Constants.optionKeys.POPUP_HEIGHT));
    Prefs.set(Constants.optionKeys.FONT_SIZE,
      Prefs.get(Constants.optionKeys.FONT_SIZE));
    if (!localStorage.getItem(Constants.dataKey.localItem)) {
      localStorage.setItem(Constants.dataKey.localItem, JSON.stringify([]));
    }
  },
};

chrome.commands.onCommand.addListener((command) => {
  if (command == 'stock-tab') {
    chrome.tabs.getSelected(window.id, function(tab) {
      /*
      if (!utils.isDuplicated(tab.url, 'items-local')) {
        Notifier.success(tab.title);
        storageUpdater.appendItem(tab.title, tab.url, "items-local");
        if (Prefs.get(Constants.optionKeys.CLOSE_ON_ADD)) {
          chrome.tabs.remove(tab.id);
        }
      } else {
        Notifier.error();
      }
      */
    });
  }
});

chrome.contextMenus.create({
  title: 'Stock this link',
  contexts: ['link'],
  onclick: (info, tab) => {
    /*
    var title, url;
    var r = new XMLHttpRequest();

    r.onreadystatechange = function() {
      eventHandlers.HTTPrequestHandler({
        requestObj: r,
        url: info.linkUrl
      });
    };
    r.open("GET", info.linkUrl, true);
    r.responseType = "document";
    r.send(null);

    console.log("[REQUESTED] " + info.linkUrl);
    */
  },
});
