// const revenueChart=document.getElementById("revenueChart");

// if(revenueChart){

// new Chart(revenueChart,{

// type:"line",

// data:{

// labels:["Jan","Feb","Mar","Apr","May","Jun","Jul"],

// datasets:[{

// label:"Revenue",

// data:[12000,18000,16000,24000,28000,25000,32000],

// borderColor:"#0d6efd",

// backgroundColor:"rgba(13,110,253,.12)",

// fill:true,

// tension:.4

// }]

// },

// options:{

// plugins:{

// legend:{display:false}

// }

// }

// });

// }

// const paymentChart=document.getElementById("paymentChart");

// if(paymentChart){

// new Chart(paymentChart,{

// type:"doughnut",

// data:{

// labels:["UPI","Card","Cash"],

// datasets:[{

// data:[55,30,15],

// backgroundColor:[

// "#0d6efd",

// "#198754",

// "#ffc107"

// ]

// }]

// },

// options:{

// plugins:{

// legend:{

// position:"bottom"

// }

// }

// }

// });

// }

// document.addEventListener("DOMContentLoaded", function () {

//     if (sessionStorage.getItem("billingScroll")) {

//         window.scrollTo(
//             0,
//             sessionStorage.getItem("billingScroll")
//         );

//         sessionStorage.removeItem("billingScroll");
//     }

//     const form = document.querySelector("form");

//     if (form) {

//         form.addEventListener("submit", function () {

//             sessionStorage.setItem(
//                 "billingScroll",
//                 window.scrollY
//             );

//         });

//     }

// });


document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       REVENUE CHART
    ========================================= */

    const revenueCanvas =
        document.getElementById("revenueChart");

    if (revenueCanvas && typeof Chart !== "undefined") {

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
                    "Jul"
                ],

                datasets: [{

                    label: "Revenue",

                    data: [
                        12000,
                        18000,
                        16000,
                        24000,
                        28000,
                        25000,
                        32000
                    ],

                    borderColor: "#0d6efd",

                    backgroundColor:
                        "rgba(13,110,253,.12)",

                    fill: true,

                    tension: 0.4

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {
                        display: false
                    }

                }

            }

        });

    }


    /* =========================================
       PAYMENT CHART
    ========================================= */

    const paymentCanvas =
        document.getElementById("paymentChart");

    if (paymentCanvas && typeof Chart !== "undefined") {

        new Chart(paymentCanvas, {

            type: "doughnut",

            data: {

                labels: [
                    "UPI",
                    "Card",
                    "Cash"
                ],

                datasets: [{

                    data: [
                        55,
                        30,
                        15
                    ],

                    backgroundColor: [
                        "#0d6efd",
                        "#198754",
                        "#ffc107"
                    ]

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }

            }

        });

    }


    /* =========================================
       BILLING FILTER SCROLL POSITION
    ========================================= */

    if (
        sessionStorage.getItem("billingScroll")
    ) {

        window.scrollTo(
            0,
            parseInt(
                sessionStorage.getItem("billingScroll"),
                10
            )
        );

        sessionStorage.removeItem(
            "billingScroll"
        );

    }


    /* =========================================
       BILLING FILTER FORM
    ========================================= */

    const form =
        document.querySelector(
            ".billing-filter-form"
        );

    if (form) {

        form.addEventListener(
            "submit",
            function () {

                sessionStorage.setItem(
                    "billingScroll",
                    window.scrollY
                );

            }
        );

    }

});