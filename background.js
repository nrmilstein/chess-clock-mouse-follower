const gameUrlRegex = /^\/game\/live\/\d+$/;

chrome.webNavigation.onHistoryStateUpdated.addListener(async event => {
  const url = new URL(event.url);
  if (url.hostname !== "www.chess.com" || !gameUrlRegex.test(url.pathname)) {
    return;
  }

  const tabs = await chrome.tabs.query({ url: "https://www.chess.com/*" });
  for (const tab of tabs) {
    chrome.tabs.sendMessage(tab.id, {
      type: "historyStateUpdated",
      url: event.url
    });
  }
});
