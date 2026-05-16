(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        var fDept = document.getElementById("ov-dept");
        var fSem = document.getElementById("ov-sem");
        var tbody = document.getElementById("ov-tbody");

        var courses = [];

        function loadCourses() {
            return fetch("../php/get_courses.php")
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    courses = Array.isArray(data) ? data : [];
                });
        }

        function fillFilters() {
            var departments = [];
            var semesters = [];

            courses.forEach(function (c) {
                if (departments.indexOf(c.department) === -1) {
                    departments.push(c.department);
                }
                if (semesters.indexOf(c.semester) === -1) {
                    semesters.push(c.semester);
                }
            });

            fDept.innerHTML = "<option value=\"\">All</option>" +
                departments.map(function (d) {
                    return "<option value=\"" + d + "\">" + d + "</option>";
                }).join("");

            fSem.innerHTML = "<option value=\"\">All</option>" +
                semesters.map(function (s) {
                    return "<option value=\"" + s + "\">" + s + "</option>";
                }).join("");
        }

        function statusBadge(pct, full) {
            if (full) return "<span class=\"badge danger\">Full</span>";
            if (pct >= 85) return "<span class=\"badge warn\">Almost full</span>";
            return "<span class=\"badge success\">Open</span>";
        }

        function render() {
            var dept = fDept.value;
            var sem = fSem.value;

            var filtered = courses.filter(function (c) {
                return (!dept || c.department === dept) &&
                    (!sem || c.semester === sem);
            });

            if (filtered.length === 0) {
                tbody.innerHTML = "<tr><td colspan=\"6\" class=\"empty\">No courses found.</td></tr>";
                return;
            }

            tbody.innerHTML = filtered.map(function (c) {
                var registered = Number(c.registered || 0);
                var capacity = Number(c.capacity || 0);
                var pct = capacity ? Math.round((registered / capacity) * 100) : 0;

                return "<tr>" +
                    "<td><strong>" + UI.escapeHtml(c.course_code) + "</strong></td>" +
                    "<td>" + UI.escapeHtml(c.title) + "</td>" +
                    "<td>" + registered + "</td>" +
                    "<td>" + capacity + "</td>" +
                    "<td>" + pct + "%</td>" +
                    "<td>" + statusBadge(pct, registered >= capacity) + "</td>" +
                    "</tr>";
            }).join("");
        }

        loadCourses()
            .then(function () {
                fillFilters();
                render();

                fDept.onchange = render;
                fSem.onchange = render;
            })
            .catch(function (error) {
                console.error(error);
                UI.toast("Failed to load overview", "error");
            });

    });

})();
