(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        var tbody        = document.getElementById("reg-tbody");
        var courseFilter = document.getElementById("reg-course-filter");

        var allRegistrations = [];


        function loadRegistrations() {
            return fetch("../php/registrations.php")
                .then(function (response) {
                    if (response.status === 401) {
                        localStorage.clear();
                        window.location.href = "../index.html";
                        return null;
                    }
                    return response.json();
                })
                .then(function (data) {
                    if (!data) { return; }
                    allRegistrations = Array.isArray(data) ? data : [];
                    populateCourseFilter();
                    render();
                });
        }


        function populateCourseFilter() {
            var seen = {};

            allRegistrations.forEach(function (r) {
                var key = r.course_code;
                if (!seen[key]) {
                    seen[key] = r.title;
                    var option = document.createElement("option");
                    option.value       = key;
                    option.textContent = key + " — " + r.title;
                    courseFilter.appendChild(option);
                }
            });
        }


        function render() {
            var selectedCode = courseFilter.value;

            var filtered = allRegistrations.filter(function (r) {
                return !selectedCode || r.course_code === selectedCode;
            });

            if (filtered.length === 0) {
                tbody.innerHTML = "<tr><td colspan=\"4\" class=\"empty\">No registrations found.</td></tr>";
                return;
            }

            tbody.innerHTML = filtered.map(function (r) {
                return "<tr>" +
                    "<td>" + UI.escapeHtml(r.student_name)       + "</td>" +
                    "<td><strong>" + UI.escapeHtml(r.course_code) + "</strong></td>" +
                    "<td>" + UI.escapeHtml(r.title)               + "</td>" +
                    "<td>" + UI.escapeHtml(r.registration_date)   + "</td>" +
                    "</tr>";
            }).join("");
        }


        courseFilter.onchange = render;

        loadRegistrations()
            .catch(function (error) {
                console.error(error);
                UI.toast("Failed to load registrations", "error");
            });
    });

})();
