chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (tab.url.indexOf('airline-club.com') > -1) {
		chrome.pageAction.show(tabId);
    }
});