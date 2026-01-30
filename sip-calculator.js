// SIP Calculator Logic

function calculateSIP() {
    // Get input values
    const monthlyInvestment = parseFloat(document.getElementById('monthly-investment').value);
    const rateOfReturn = parseFloat(document.getElementById('rate-of-return').value);
    const timePeriod = parseInt(document.getElementById('time-period').value);
    
    // Update display values
    document.getElementById('monthly-display').textContent = `₹${monthlyInvestment.toLocaleString('en-IN')}`;
    document.getElementById('rate-display').textContent = `${rateOfReturn}%`;
    document.getElementById('period-display').textContent = `${timePeriod} ${timePeriod === 1 ? 'Year' : 'Years'}`;
    
    // Calculate SIP
    const monthlyRate = rateOfReturn / 12 / 100;
    const months = timePeriod * 12;
    
    // SIP Future Value Formula
    const futureValue = monthlyInvestment * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const investedAmount = monthlyInvestment * months;
    const estimatedReturns = futureValue - investedAmount;
    
    // Format numbers
    const invested = Math.round(investedAmount);
    const returns = Math.round(estimatedReturns);
    const total = Math.round(futureValue);
    
    // Update results display
    document.getElementById('invested-amount').textContent = `₹${invested.toLocaleString('en-IN')}`;
    document.getElementById('estimated-returns').textContent = `₹${returns.toLocaleString('en-IN')}`;
    document.getElementById('total-value').textContent = `₹${total.toLocaleString('en-IN')}`;
    
    // Update chart display
    const totalLakhs = (total / 100000).toFixed(1);
    document.getElementById('total-display-chart').textContent = `₹${totalLakhs}L`;
    
    // Update donut chart
    updateDonutChart(invested, returns, total);
}

function updateDonutChart(invested, returns, total) {
    const circumference = 2 * Math.PI * 80; // radius = 80
    
    const investedPercentage = invested / total;
    const returnsPercentage = returns / total;
    
    const investedArc = document.getElementById('invested-arc');
    const returnsArc = document.getElementById('returns-arc');
    
    // Set invested arc
    const investedLength = circumference * investedPercentage;
    investedArc.setAttribute('stroke-dasharray', `${investedLength} ${circumference}`);
    investedArc.setAttribute('stroke-dashoffset', '0');
    
    // Set returns arc
    const returnsLength = circumference * returnsPercentage;
    returnsArc.setAttribute('stroke-dasharray', `${returnsLength} ${circumference}`);
    returnsArc.setAttribute('stroke-dashoffset', `-${investedLength}`);
}

// Calculate on page load
document.addEventListener('DOMContentLoaded', function() {
    calculateSIP();
});