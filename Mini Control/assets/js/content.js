chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const mediaElement = document.querySelector('video, audio');

  if (!mediaElement) {
      sendResponse({ state: 'no-media' });
      return;
  }

  let mediaTitle = document.title;
  let thumbnailUrl = '';

  // If it's YouTube, extract the thumbnail
  if (window.location.hostname.includes('youtube.com')) {
      const videoId = new URL(window.location.href).searchParams.get('v');
      thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
  } else {
      // Fallback if not YouTube (general sites might require customization)
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
          thumbnailUrl = ogImage.content;
      }
  }

  switch (message.action) {
      case 'play':
          mediaElement.play();
          sendResponse({ state: 'playing' });
          break;
      case 'pause':
          mediaElement.pause();
          sendResponse({ state: 'paused' });
          break;
      case 'mute':
          mediaElement.muted = !mediaElement.muted;
          break;
      case 'loop':
          mediaElement.loop = !mediaElement.loop;
          break;
      case 'changeSpeed':
          mediaElement.playbackRate = message.value;
          break;
      case 'setVolume':
          mediaElement.volume = message.value;
          break;
      case 'getPlaybackState':
          const state = mediaElement.paused ? 'paused' : 'playing';
          sendResponse({ 
              state: state, 
              volume: mediaElement.volume, 
              title: mediaTitle, 
              thumbnail: thumbnailUrl 
          });
          break;
      default:
          break;
  }
});
