import tldjs from 'tldjs'
import staticBlocksStore from './BlocksStore';

const trackers = [
  '*://*.adnxs.com/*',
  '*://*.advertising.com/*',
  '*://*.doubleclick.net/*',
  '*://*.facebook.com/*',
  '*://*.facebook.net/*',
  '*://*.fbcdn.net/*',
  '*://*.fonts.googleapis.com/*',
  '*://*.google-analytics.com/*',
  '*://*.google.com/*',
  '*://*.googleadservices.com/*',
  '*://*.googlesyndication.com/*',
  '*://*.googletagservices.com/*',
  '*://*.gstatic.com/*',
  '*://*.mathtag.com/*',
  '*://*.openx.net/*',
  '*://*.rubiconproject.com/*',
  '*://*.scorecardresearch.com/*',
  '*://*.twitter.com/*',
  '*://*.yahoo.com/*'
];

const trackerSet = new Set(trackers);

const reformatURL = (url) => {
  const { hostname } = new URL(url);
  return `*://*.${tldjs.getDomain(hostname)}/*`;
};

chrome.webRequest.onBeforeRequest.addListener(
  ({ initiator, tabId, type, url }) => {
    if (
      initiator // filter preloads
      && !trackerSet.has(reformatURL(initiator)) // doesn't block if we're on tracker's own page (i.e. google, facebook)
      && type !== 'main_frame' // too allow redirects
    ) {
      console.log("Tracker being blocked from ", url)
      staticBlocksStore.add(tabId, url)
      return { cancel: true };
    }
    return {};
  },
  { urls: trackers },
  ['blocking']
);


chrome.tabs.onRemoved.addListener(
  (tabId) => {
    console.log("Remove closed tab ", tabId)
    staticBlocksStore.remove(tabId)
  }
)

chrome.tabs.onActivated.addListener(
  ({ tabId }) => {
    console.log("Set new tab ", tabId)
    staticBlocksStore.setTab(tabId)
    chrome.storage.local.set({ "currentTab": tabId }, () => {
      console.log("Value set in Chrome storage for the session");
    })
  });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == 'popup_to_background') {
    chrome.runtime.sendMessage({
      msg: "loadtab",
      data: {
        content: staticBlocksStore.get(staticBlocksStore.currentTab)
      }
    })
  }
})

