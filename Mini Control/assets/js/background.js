chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
      chrome.storage.local.get(['welcomeShown'], (result) => {
          if (!result.welcomeShown) {
              chrome.tabs.create({
                  url: chrome.runtime.getURL('welcome.html'),
                  active: true // Optionally make the tab active
              });
          }
      });
  }
});
