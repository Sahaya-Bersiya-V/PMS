document.addEventListener("DOMContentLoaded", function () {

    const menuButton =
        document.getElementById("mobileMenuBtn");

    const sidebar =
        document.querySelector(".sidebar");

    const overlay =
        document.getElementById("sidebarOverlay");


    if (!menuButton || !sidebar || !overlay) {
        return;
    }


    /* =========================================
       OPEN SIDEBAR
    ========================================= */

    menuButton.addEventListener("click", function () {

        sidebar.classList.add("open");

        overlay.classList.add("show");

        document.body.classList.add("sidebar-open");

    });


    /* =========================================
       CLOSE SIDEBAR
    ========================================= */

    overlay.addEventListener("click", function () {

        closeSidebar();

    });


    /* =========================================
       CLOSE FUNCTION
    ========================================= */

    function closeSidebar() {

        sidebar.classList.remove("open");

        overlay.classList.remove("show");

        document.body.classList.remove("sidebar-open");

    }


    /* =========================================
       CLOSE WHEN CLICKING A MENU ITEM
       ON MOBILE
    ========================================= */

    const sidebarLinks =
        sidebar.querySelectorAll("a");

    sidebarLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (window.innerWidth <= 767) {

                closeSidebar();

            }

        });

    });


    /* =========================================
       CLOSE SIDEBAR WHEN SCREEN BECOMES DESKTOP
    ========================================= */

    window.addEventListener("resize", function () {

        if (window.innerWidth > 767) {

            closeSidebar();

        }

    });

});