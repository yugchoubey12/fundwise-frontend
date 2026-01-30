document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("investment-form");
    const resultsSection = document.getElementById("results-section");
    const formSection = document.getElementById("form-section");

    if (!form) return;

    /* ================= GOAL SELECTION ================= */
    window.selectGoal = function (goalValue, button) {
        document.getElementById("goal").value = goalValue;

        document.querySelectorAll(".goal-btn").forEach(btn =>
            btn.classList.remove("active")
        );
        button.classList.add("active");
    };

    /* ================= FORM SUBMIT ================= */
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const payload = {
            sip: Number(document.getElementById("monthly-investment").value),
            years: Number(document.getElementById("duration").value),
            goal: document.getElementById("goal").value
        };

        if (!payload.goal) {
            alert("Please select an investment goal.");
            return;
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/recommend-funds", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            renderResults(data);

            formSection.classList.add("hidden");
            resultsSection.classList.remove("hidden");

        } catch {
            alert("Something went wrong. Please try again.");
        }
    });

    /* ================= DONUT CHART ================= */
    function renderDonutChart(allocation) {
        const container = document.getElementById("donut-chart");
        if (!container) return;

        const colors = {
            Equity: "var(--blue-600)",
            Debt: "var(--emerald-600)",
            Hybrid: "var(--purple-600)"
        };

        const radius = 70;
        const strokeWidth = 18;
        const center = 110;
        const circumference = 2 * Math.PI * radius;

        let offset = 0;
        let circles = "";

        Object.entries(allocation).forEach(([type, percent], index) => {
            const dash = (percent / 100) * circumference;

            circles += `
                <circle
                    cx="${center}"
                    cy="${center}"
                    r="${radius}"
                    fill="none"
                    stroke="${colors[type]}"
                    stroke-width="${strokeWidth}"
                    stroke-dasharray="${dash} ${circumference}"
                    stroke-dashoffset="${circumference}"
                    stroke-linecap="round"
                    class="donut-segment"
                    style="--target-offset:${-offset};animation-delay:${index * 0.25}s"
                    data-label="${type} • ${percent}%"
                />
            `;
            offset += dash;
        });

        container.innerHTML = `
            <svg viewBox="0 0 220 220">
                <g transform="rotate(-90 110 110)">
                    ${circles}
                </g>
                <text x="110" y="110"
                      text-anchor="middle"
                      dominant-baseline="middle"
                      fill="var(--text-primary)"
                      font-size="14"
                      font-weight="600">
                    Your Mix
                </text>
            </svg>
        `;
    }

    /* ================= GEN-Z EXPLANATION ================= */
    function getGenZAllocationExplanation(allocation) {
        const equity = allocation.Equity || 0;

        if (equity >= 65) {
            return "Most of your money is set up for long-term growth. Short-term ups and downs are normal — this is how wealth is built.";
        }
        if (equity >= 40) {
            return "This is a balanced setup — your money grows steadily without extreme swings.";
        }
        return "This portfolio focuses more on stability, keeping your money safer while it grows gradually.";
    }

    /* ================= RESULTS ================= */
    function renderResults(data) {
        document.getElementById("user-type").innerText =
            `Built for ${data.investment_horizon} • ${data.risk_profile} style`;

        /* Allocation legend */
        const legend = document.getElementById("allocation-legend");
        legend.innerHTML = "";

        Object.entries(data.allocation).forEach(([type, percent]) => {
            legend.innerHTML += `
                <div class="legend-item">
                    <span class="legend-color ${type.toLowerCase()}"></span>
                    <span>${type} • ${percent}%</span>
                </div>
            `;
        });

        renderDonutChart(data.allocation);

        /* Allocation explanation */
        const note = document.querySelector(".allocation-note");
        note.innerHTML = `
            ${getGenZAllocationExplanation(data.allocation)}
            <a href="learn.html?topic=types-of-mf"> Learn how these funds work →</a>
        `;

        /* Funds */
        const fundList = document.getElementById("fund-list");
        fundList.innerHTML = "";

        Object.entries(data.recommended_funds).forEach(([category, funds]) => {
            if (!funds.length) return;

            const section = document.createElement("div");
            section.className = "fund-category";
            section.innerHTML = `<h4>${category} Funds</h4>`;

            funds.forEach(fund => {
                section.innerHTML += `
                    <div class="fund-card">
                        <h5>${fund.scheme_name}</h5>
                        <p>${fund.sub_category}</p>
                        <strong>
                            ${data.metric_used.replace("_", " ")}:
                            ${fund[data.metric_used] ?? "N/A"}%
                        </strong>
                    </div>
                `;
            });

            fundList.appendChild(section);
        });
    }

    /* ================= RESET ================= */
    window.resetForm = function () {
        resultsSection.classList.add("hidden");
        formSection.classList.remove("hidden");
        form.reset();

        document.querySelectorAll(".goal-btn").forEach(btn =>
            btn.classList.remove("active")
        );
    };

    /* ================= DONUT TOOLTIP ================= */
    const tooltip = document.createElement("div");
    tooltip.id = "donut-tooltip";
    document.body.appendChild(tooltip);

    document.addEventListener("mousemove", e => {
        tooltip.style.left = e.pageX + 12 + "px";
        tooltip.style.top = e.pageY + 12 + "px";
    });

    document.addEventListener("mouseover", e => {
        if (e.target.classList.contains("donut-segment")) {
            tooltip.textContent = e.target.dataset.label;
            tooltip.style.opacity = 1;
        }
    });

    document.addEventListener("mouseout", e => {
        if (e.target.classList.contains("donut-segment")) {
            tooltip.style.opacity = 0;
        }
    });
});
