// DOM Elements
const themeSwitch = document.getElementById('theme-switch');
const totalCashInput = document.getElementById('total-cash');
const burnRateInput = document.getElementById('burn-rate');
const calculateBtn = document.getElementById('calculate-btn');
const runwayValue = document.getElementById('runway-value');
const daysValue = document.getElementById('days-value');
const insightText = document.getElementById('insight-text');
const chartCanvas = document.getElementById('chart-canvas');

// Dark Mode Toggle
themeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

// Calculate Runway
calculateBtn.addEventListener('click', () => {
    const totalCash = parseFloat(totalCashInput.value);
    const burnRate = parseFloat(burnRateInput.value);

    if (!totalCash || !burnRate || burnRate <= 0) {
        alert('Please enter valid numbers for Total Cash and Monthly Burn Rate.');
        return;
    }

    // Show loading
    calculateBtn.classList.add('loading');
    calculateBtn.innerHTML = 'Calculating...<span class="spinner"></span>';

    // Simulate calculation delay
    setTimeout(() => {
        const runwayMonths = totalCash / burnRate;
        const daysToZero = Math.floor(runwayMonths * 30.44); // Average days per month
        const today = new Date();
        const zeroDate = new Date();
        zeroDate.setDate(today.getDate() + daysToZero);

        const formattedDate = zeroDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
    document.getElementById("zero-date").textContent = formattedDate;

        // Update outputs
        updateRunwayDisplay(runwayMonths, daysToZero);

        // Update insights
        updateInsights(runwayMonths);

        // Draw fake chart
        drawChart(runwayMonths);

        // Hide loading
        calculateBtn.classList.remove('loading');
        calculateBtn.innerHTML = 'Calculate Runway';
    }, 1500);
});

function updateRunwayDisplay(months, days) {
    runwayValue.textContent = months.toFixed(1) + ' months';
    daysValue.textContent = days + ' days';

    // Remove previous color classes
    runwayValue.classList.remove('green', 'yellow', 'red');
    daysValue.classList.remove('green', 'yellow', 'red');

    // Add color based on runway
    let colorClass;
    if (months >= 6) {
        colorClass = 'green';
    } else if (months >= 3) {
        colorClass = 'yellow';
    } else {
        colorClass = 'red';
    }

    runwayValue.classList.add(colorClass);
    daysValue.classList.add(colorClass);
    const runwayCard = document.getElementById("runway-card");
    const daysCard = document.getElementById("days-card");

    runwayCard.classList.remove("green", "yellow", "red");
    daysCard.classList.remove("green", "yellow", "red");

    runwayCard.classList.add(colorClass);
    daysCard.classList.add(colorClass);

}

function updateInsights(months) {
    let text;
    if (months < 3) {
        text = '🚨 URGENT: Reduce burn immediately. Consider cutting non-essential expenses and exploring funding options.';
    } else if (months < 6) {
        text = '⚠️ Consider optimizing expenses. Review your burn rate and look for cost-saving opportunities.';
    } else {
        text = '✅ You\'re in a safe zone. Keep monitoring your runway and continue building sustainably.';
    }
    insightText.textContent = text;
}

function drawChart(runwayMonths) {
    const ctx = chartCanvas.getContext('2d');
    const width = chartCanvas.width;
    const height = chartCanvas.height;

    ctx.clearRect(0, 0, width, height);

    const months = 12;
    let cash = parseFloat(totalCashInput.value);
    const burn = parseFloat(burnRateInput.value);

    let data = [];

    for (let i = 0; i <= months; i++) {
        data.push(cash);
        cash -= burn;
        if (cash < 0) cash = 0;
    }

    const maxCash = Math.max(...data);

    // 🎨 Gradient for bars
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#667eea");
    gradient.addColorStop(1, "#764ba2");

    const barWidth = width / months - 15;

    data.forEach((value, index) => {
        const barHeight = (value / maxCash) * (height - 50);

        const x = index * (width / months) + 10;
        const y = height - barHeight - 20;

        // Rounded bars
        const radius = 6;

        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y + barHeight);
        ctx.lineTo(x + barWidth, y + barHeight);
        ctx.lineTo(x + barWidth, y + radius);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth - radius, y);
        ctx.lineTo(x + radius, y);
        ctx.quadraticCurveTo(x, y, x, y + radius);
        ctx.closePath();

        ctx.fillStyle = gradient;
        ctx.fill();
    });

    // Axis labels (cleaner)
    ctx.fillStyle = "#888";
    ctx.font = "12px sans-serif";
    ctx.fillText("Months →", width - 80, height - 5);
}
// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Any initial setup
});