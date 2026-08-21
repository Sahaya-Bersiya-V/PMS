document.addEventListener("DOMContentLoaded", function () {

    console.log("Reports JS loaded");


    // =====================================================
    // CHECK CHART.JS
    // =====================================================

    if (typeof Chart === "undefined") {

        console.error(
            "Chart.js is not loaded."
        );

        return;
    }


    // =====================================================
    // GET DATA
    // =====================================================

    const revenueLabelsElement =
        document.getElementById(
            "revenue-labels"
        );

    const revenueValuesElement =
        document.getElementById(
            "revenue-values"
        );

    const sourceCountsElement =
        document.getElementById(
            "source-counts"
        );


    if (
        !revenueLabelsElement ||
        !revenueValuesElement ||
        !sourceCountsElement
    ) {

        console.error(
            "Report chart data elements not found."
        );

        return;
    }


    const revenueLabels =
        JSON.parse(
            revenueLabelsElement.textContent
        );


    const revenueValues =
        JSON.parse(
            revenueValuesElement.textContent
        );


    const sourceCounts =
        JSON.parse(
            sourceCountsElement.textContent
        );


    console.log(
        "Revenue Labels:",
        revenueLabels
    );

    console.log(
        "Revenue Values:",
        revenueValues
    );

    console.log(
        "Booking Sources:",
        sourceCounts
    );


    // =====================================================
    // REVENUE CHART
    // =====================================================

    const revenueCanvas =
        document.getElementById(
            "revenueReportChart"
        );


    if (revenueCanvas) {

        new Chart(
            revenueCanvas,
            {
                type: "line",

                data: {

                    labels: revenueLabels,

                    datasets: [

                        {
                            label: "Revenue",

                            data: revenueValues,

                            borderWidth: 3,

                            tension: 0.35,

                            fill: true,

                            pointRadius: 4,

                            pointHoverRadius: 6
                        }

                    ]
                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    interaction: {

                        intersect: false,

                        mode: "index"
                    },


                    plugins: {

                        legend: {

                            display: false
                        },


                        tooltip: {

                            callbacks: {

                                label:
                                    function (context) {

                                        return (
                                            " ₹" +
                                            Number(
                                                context.raw
                                            ).toLocaleString(
                                                "en-IN"
                                            )
                                        );

                                    }

                            }

                        }

                    },


                    scales: {

                        x: {

                            grid: {

                                display: false
                            }

                        },


                        y: {

                            beginAtZero: true,

                            grid: {

                                color:
                                    "#e9edf3"
                            },


                            ticks: {

                                callback:
                                    function (value) {

                                        return (
                                            "₹" +
                                            Number(
                                                value
                                            ).toLocaleString(
                                                "en-IN"
                                            )
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

    }


    // =====================================================
    // BOOKING SOURCE CHART
    // =====================================================

    const sourceCanvas =
        document.getElementById(
            "bookingSourceChart"
        );


    if (sourceCanvas) {

        const labels =
            Object.keys(
                sourceCounts
            );


        const values =
            Object.values(
                sourceCounts
            );


        console.log(
            "Source labels:",
            labels
        );

        console.log(
            "Source values:",
            values
        );


        if (labels.length === 0) {

            console.warn(
                "No booking source data available."
            );

        } else {

            new Chart(
                sourceCanvas,
                {
                    type: "doughnut",

                    data: {

                        labels: labels,

                        datasets: [

                            {
                                data: values,

                                borderWidth: 2,

                                hoverOffset: 5
                            }

                        ]

                    },


                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        cutout: "62%",


                        plugins: {

                            legend: {

                                position: "bottom",

                                labels: {

                                    padding: 18,

                                    usePointStyle: true,

                                    pointStyle: "circle"
                                }

                            }

                        }

                    }

                }
            );

        }

    }

});