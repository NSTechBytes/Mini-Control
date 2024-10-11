const toggleButton = document.getElementById('colorModeToggle');
        let darkMode = false;

        toggleButton.addEventListener('click', () => {
            darkMode = !darkMode;
            document.body.classList.toggle('dark-mode', darkMode);
            toggleButton.innerHTML = darkMode ? 
                '<i class="fas fa-moon"></i> Switch to Light Mode' : 
                '<i class="fas fa-sun"></i> Switch to Dark Mode';
        });