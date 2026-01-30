// ========================================
// FundWise JavaScript - Core Functionality
// ========================================

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();

    // ===============================
    // Legal Disclaimer Popup (HOMEPAGE ONLY)
    // ===============================
    const isHomePage =
        window.location.pathname.endsWith("index.html") ||
        window.location.pathname === "/" ||
        window.location.pathname === "";

    if (!isHomePage) return;

    const popup = document.getElementById("legal-popup");
    const acceptBtn = document.getElementById("legal-accept-btn");

    // If popup HTML is not present, do nothing
    if (!popup || !acceptBtn) return;

    const hasAccepted = localStorage.getItem("fundwise_legal_accepted");

    if (!hasAccepted) {
        popup.classList.remove("hidden");
    }

    acceptBtn.addEventListener("click", function () {
        localStorage.setItem("fundwise_legal_accepted", "true");
        popup.classList.add("hidden");
    });
});


// ========================================
// Dark Mode Functionality
// ========================================

function initializeTheme() {
    // Check if user has a saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcons(savedTheme);
    } else {
        // Default to light mode
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeIcons('light');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Set the new theme
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Update icons
    updateThemeIcons(newTheme);
}

function updateThemeIcons(theme) {
    // Desktop theme toggle
    const desktopToggle = document.getElementById('theme-toggle');
    if (desktopToggle) {
        const sunIcon = desktopToggle.querySelector('.sun-icon');
        const moonIcon = desktopToggle.querySelector('.moon-icon');
        
        if (theme === 'dark') {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    }
    
    // Mobile theme toggle
    const mobileToggle = document.getElementById('theme-toggle-mobile');
    if (mobileToggle) {
        const sunIcon = mobileToggle.querySelector('.sun-icon');
        const moonIcon = mobileToggle.querySelector('.moon-icon');
        
        if (theme === 'dark') {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    }
}

// ========================================
// Dropdown Menu
// ========================================

function toggleDropdown() {
    const dropdown = document.getElementById('dropdown-menu');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('dropdown-menu');
    const dropdownBtn = document.querySelector('.dropdown-btn');
    
    if (dropdown && dropdownBtn) {
        if (!dropdown.contains(event.target) && !dropdownBtn.contains(event.target)) {
            dropdown.classList.remove('active');
        }
    }
});

// ========================================
// Mobile Menu
// ========================================

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');
    
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
    
    if (menuIcon && closeIcon) {
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    }
}