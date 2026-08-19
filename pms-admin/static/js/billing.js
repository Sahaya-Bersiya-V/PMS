document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // MONTHLY REVENUE CHART
    // ==========================================

    const revenueCanvas =
        document.getElementById("revenueChart");

    if (revenueCanvas) {

        // Destroy existing chart if one already exists
        const existingRevenueChart =
            Chart.getChart(revenueCanvas);

        if (existingRevenueChart) {
            existingRevenueChart.destroy();
        }

        const revenueDataElement =
            document.getElementById("monthly-revenue-data");

        let revenueData = [];

        if (revenueDataElement) {

            try {

                revenueData =
                    JSON.parse(
                        revenueDataElement.textContent
                    );

            } catch (error) {

                console.error(
                    "Revenue data error:",
                    error
                );

            }

        }

        new Chart(revenueCanvas, {

            type: "line",

            data: {

                labels: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec"
                ],

                datasets: [{

                    label: "Revenue",

                    data: revenueData,

                    borderWidth: 3,

                    tension: 0.4,

                    fill: true,

                    pointRadius: 4,

                    pointHoverRadius: 6

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {

                            callback: function (value) {

                                return "₹" +
                                    Number(value)
                                        .toLocaleString("en-IN");

                            }

                        }

                    }

                }

            }

        });

    }


    // ==========================================
    // INVOICE STATUS DONUT
    // ==========================================

    const statusCanvas =
        document.getElementById(
            "invoiceStatusChart"
        );

    if (statusCanvas) {

        const existingStatusChart =
            Chart.getChart(statusCanvas);

        if (existingStatusChart) {

            existingStatusChart.destroy();

        }

        const statusDataElement =
            document.getElementById(
                "invoice-status-data"
            );

        let statusData = {};

        if (statusDataElement) {

            try {

                statusData =
                    JSON.parse(
                        statusDataElement.textContent
                    );

            } catch (error) {

                console.error(
                    "Invoice status data error:",
                    error
                );

            }

        }

        const labels =
            Object.keys(statusData);

        const values =
            Object.values(statusData)
                .map(Number);

        const total =
            values.reduce(
                (sum, value) => sum + value,
                0
            );


        // ==========================================
        // NO DATA
        // ==========================================

        if (total === 0) {

            const chartContainer =
                statusCanvas.parentElement;

            chartContainer.innerHTML = `

                <div class="empty-chart">

                    <i class="bi bi-pie-chart"></i>

                    <span>
                        No invoice data available
                    </span>

                </div>

            `;

            return;

        }


        // ==========================================
        // CREATE DONUT
        // ==========================================

        new Chart(statusCanvas, {

            type: "doughnut",

            data: {

                labels: labels,

                datasets: [{

                    data: values,

                    borderWidth: 3,

                    hoverOffset: 6

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "68%",

                plugins: {

                    legend: {

                        position: "bottom",

                        labels: {

                            padding: 18,

                            usePointStyle: true

                        }

                    }

                }

            }

        });

    }

});