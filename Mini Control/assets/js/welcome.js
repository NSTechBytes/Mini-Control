// Toggle color mode
document.getElementById('color-mode').addEventListener('click', () => {
    const body = document.body;
    const isDarkMode = body.classList.toggle('dark-mode');
    
    const modeIcon = document.getElementById('color-mode');
    modeIcon.classList.toggle('fa-sun', !isDarkMode);
    modeIcon.classList.toggle('fa-moon', isDarkMode);

    // Save the theme preference
    chrome.storage.local.set({ theme: isDarkMode ? 'dark' : 'light' });
});

// Apply the saved theme on page load
chrome.storage.local.get(['theme'], (result) => {
    const theme = result.theme || 'light';
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('color-mode').classList.add('fa-moon');
    } else {
        document.getElementById('color-mode').classList.add('fa-sun');
    }
});

document.getElementById('get-started').addEventListener('click', () => {
    chrome.storage.local.set({ welcomeShown: true }, () => {
        window.close(); // Close the welcome page tab
    });
});
