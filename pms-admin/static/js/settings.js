document.addEventListener("DOMContentLoaded", function () {

    const navItems =
        document.querySelectorAll(".settings-nav-item");

    const sections =
        document.querySelectorAll(".settings-section");


    navItems.forEach(function (item) {

        item.addEventListener("click", function () {

            const sectionName =
                this.dataset.section;


            navItems.forEach(function (nav) {

                nav.classList.remove("active");

            });


            sections.forEach(function (section) {

                section.classList.remove("active");

            });


            this.classList.add("active");


            const target =
                document.getElementById(
                    sectionName + "-section"
                );


            if (target) {

                target.classList.add("active");

            }

        });

    });

});