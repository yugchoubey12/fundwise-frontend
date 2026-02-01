// Initialize theme from localStorage or default to light
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
}

// Update theme icons
function updateThemeIcons(theme) {
    const sunIcons = document.querySelectorAll('.sun-icon');
    const moonIcons = document.querySelectorAll('.moon-icon');
    
    if (theme === 'dark') {
        sunIcons.forEach(icon => icon.classList.add('hidden'));
        moonIcons.forEach(icon => icon.classList.remove('hidden'));
    } else {
        sunIcons.forEach(icon => icon.classList.remove('hidden'));
        moonIcons.forEach(icon => icon.classList.add('hidden'));
    }
}

// Toggle dropdown menu
function toggleDropdown() {
    const dropdown = document.getElementById('dropdown-menu');
    dropdown.classList.toggle('active');
}

// Toggle mobile menu
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');
    
    mobileMenu.classList.toggle('active');
    menuIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.dropdown');
    const dropdownMenu = document.getElementById('dropdown-menu');
    
    if (dropdown && !dropdown.contains(event.target)) {
        dropdownMenu.classList.remove('active');
    }
});

// Format currency in Indian style
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN', {
        maximumFractionDigits: 0
    });
}

// Calculate SIP returns
function calculateSIP() {
    // Get input values
    const monthlyInvestment = parseFloat(document.getElementById('monthly-investment').value);
    const annualRate = parseFloat(document.getElementById('rate-of-return').value);
    const timePeriod = parseInt(document.getElementById('time-period').value);
    
    // Update display values
    document.getElementById('monthly-display').textContent = formatCurrency(monthlyInvestment);
    document.getElementById('rate-display').textContent = `${annualRate}%`;
    document.getElementById('period-display').textContent = `${timePeriod} ${timePeriod === 1 ? 'Year' : 'Years'}`;
    
    // Calculate SIP returns using the compound interest formula
    // FV = P × [((1 + r)^n - 1) / r] × (1 + r)
    const monthlyRate = annualRate / 12 / 100; // Convert annual rate to monthly decimal
    const totalMonths = timePeriod * 12;
    
    // Calculate future value
    let futureValue;
    if (monthlyRate === 0) {
        // If rate is 0, simple multiplication
        futureValue = monthlyInvestment * totalMonths;
    } else {
        futureValue = monthlyInvestment * 
            (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * 
            (1 + monthlyRate));
    }
    
    // Calculate invested amount and returns
    const investedAmount = monthlyInvestment * totalMonths;
    const estimatedReturns = futureValue - investedAmount;
    
    // Update result displays
    document.getElementById('invested-amount').textContent = formatCurrency(Math.round(investedAmount));
    document.getElementById('estimated-returns').textContent = formatCurrency(Math.round(estimatedReturns));
    document.getElementById('total-value').textContent = formatCurrency(Math.round(futureValue));
    document.getElementById('total-display-chart').textContent = formatCurrency(Math.round(futureValue));
    
    // Update donut chart
    updateDonutChart(investedAmount, estimatedReturns);
}

// Update the donut chart visualization
function updateDonutChart(invested, returns) {
    const total = invested + returns;
    const investedPercentage = (invested / total) * 100;
    const returnsPercentage = (returns / total) * 100;
    
    // Calculate stroke-dasharray values for the donut chart
    const circumference = 2 * Math.PI * 80; // 80 is the radius
    
    // Invested arc (green) - starts at top (12 o'clock position)
    const investedArc = document.getElementById('invested-arc');
    const investedLength = (investedPercentage / 100) * circumference;
    investedArc.setAttribute('stroke-dasharray', `${investedLength} ${circumference - investedLength}`);
    investedArc.setAttribute('stroke-dashoffset', circumference * 0.25); // Start from top
    investedArc.setAttribute('transform', 'rotate(-90 100 100)'); // Rotate to start from top
    
    // Returns arc (blue) - continues after invested arc to complete the circle
    const returnsArc = document.getElementById('returns-arc');
    const returnsLength = (returnsPercentage / 100) * circumference;
    returnsArc.setAttribute('stroke-dasharray', `${returnsLength} ${circumference - returnsLength}`);
    // Offset to start where invested arc ends
    returnsArc.setAttribute('stroke-dashoffset', circumference * 0.25 - investedLength);
    returnsArc.setAttribute('transform', 'rotate(-90 100 100)'); // Rotate to start from top
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    calculateSIP(); // Calculate with default values
});