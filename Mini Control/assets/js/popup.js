function sendMessageToActiveTab(action, value = null, callback = null) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['assets/js/content.js']
      }, () => {
          chrome.tabs.sendMessage(tabs[0].id, { action: action, value: value }, callback);
      });
  });
}

function updateButtonStates(playActive, pauseActive) {
  const playButton = document.getElementById('play');
  const pauseButton = document.getElementById('pause');
  
  playButton.classList.toggle('active', playActive);
  pauseButton.classList.toggle('active', pauseActive);
}

function applyTheme(theme) {
  const body = document.getElementById('popup-body');
  const themeIcon = document.getElementById('theme-icon');
  
  if (theme === 'dark') {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
  } else {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
  }
}

function saveThemePreference(theme) {
  chrome.storage.local.set({ theme: theme });
}

document.getElementById('play').addEventListener('click', () => {
  sendMessageToActiveTab('play');
  updateButtonStates(false, true);  // Show Pause button as active
});

document.getElementById('pause').addEventListener('click', () => {
  sendMessageToActiveTab('pause');
  updateButtonStates(true, false);  // Show Play button as active
});

document.getElementById('mute').addEventListener('click', () => {
  sendMessageToActiveTab('mute');
});

document.getElementById('loop').addEventListener('click', () => {
  sendMessageToActiveTab('loop');
});

document.getElementById('speed-select').addEventListener('change', (e) => {
  const speed = parseFloat(e.target.value);
  sendMessageToActiveTab('changeSpeed', speed);
});

document.getElementById('volume-slider').addEventListener('input', (e) => {
  const volume = e.target.value / 100;
  sendMessageToActiveTab('setVolume', volume);
  document.getElementById('volume-percentage').innerText = `${e.target.value}%`;
});

document.getElementById('theme-icon').addEventListener('click', () => {
  const body = document.getElementById('popup-body');
  const isDarkMode = body.classList.contains('dark-mode');
  
  if (isDarkMode) {
      applyTheme('light');
      saveThemePreference('light');
  } else {
      applyTheme('dark');
      saveThemePreference('dark');
  }
});

// Load the saved theme on popup load
chrome.storage.local.get(['theme'], (result) => {
  const theme = result.theme || 'light';
  applyTheme(theme);
});

// Check media playback state when popup opens
sendMessageToActiveTab('getPlaybackState', null, (response) => {
  const controls = document.getElementById('controls');
  const mediaInfo = document.getElementById('media-info');
  const noMediaMessage = document.getElementById('no-media-message');
  
  if (response && response.state === 'no-media') {
      controls.style.display = 'none';
      mediaInfo.style.display = 'none';
      noMediaMessage.style.display = 'block';  // Ensure this is visible
  } else if (response && response.state) {
      controls.style.display = 'block';
      mediaInfo.style.display = 'block';
      noMediaMessage.style.display = 'none';

      // Update media title and thumbnail
      document.getElementById('media-title').innerText = response.title;
      document.getElementById('media-thumbnail').src = response.thumbnail;

      // Update play/pause button states
      updateButtonStates(response.state === 'paused', response.state === 'playing');
      document.getElementById('volume-slider').value = response.volume * 100;
      document.getElementById('volume-percentage').innerText = `${Math.round(response.volume * 100)}%`;
  }
});
