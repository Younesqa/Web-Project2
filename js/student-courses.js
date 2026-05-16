(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        var container     = document.getElementById("course-list");
        var emptyState    = document.getElementById("empty-state");
        var searchInput   = document.getElementById("q");
        var deptFilter    = document.getElementById("f-dept");
        var semFilter     = document.getElementById("f-sem");
        var creditsFilter = document.getElementById("f-credits");

        var allCourses = [];


        fetch("../php/get_courses.php")
            .then(function (response) { return response.json(); })
            .then(function (courses) {
                if (!Array.isArray(courses) || courses.length === 0) {
                    container.innerHTML = "<p class=\"muted\">No courses available.</p>";
                    return;
                }

                allCourses = courses;
                populateFilters(courses);
                renderCourses(courses);
                attachFilterEvents();
            })
            .catch(function (error) {
                console.error(error);
                container.innerHTML = "<p class=\"muted\">Failed to load courses.</p>";
            });


        function populateFilters(courses) {
            var departments = [];
            var semesters   = [];

            courses.forEach(function (course) {
                if (course.department && departments.indexOf(course.department) === -1) {
                    departments.push(course.department);
                }
                if (course.semester && semesters.indexOf(course.semester) === -1) {
                    semesters.push(course.semester);
                }
            });

            departments.sort();
            semesters.sort();

            departments.forEach(function (department) {
                var option = document.createElement("option");
                option.value       = department;
                option.textContent = department;
                deptFilter.appendChild(option);
            });

            semesters.forEach(function (semester) {
                var option = document.createElement("option");
                option.value       = semester;
                option.textContent = semester;
                semFilter.appendChild(option);
            });
        }


        function attachFilterEvents() {
            searchInput.addEventListener("input",   applyFilters);
            deptFilter.addEventListener("change",   applyFilters);
            semFilter.addEventListener("change",    applyFilters);
            creditsFilter.addEventListener("change", applyFilters);
        }


        function applyFilters() {
            var searchValue        = searchInput.value.trim().toLowerCase();
            var selectedDepartment = deptFilter.value;
            var selectedSemester   = semFilter.value;
            var selectedCredits    = creditsFilter.value;

            var filtered = allCourses.filter(function (course) {
                var matchesSearch =
                    !searchValue ||
                    (course.title       && course.title.toLowerCase().indexOf(searchValue)       !== -1) ||
                    (course.course_code && course.course_code.toLowerCase().indexOf(searchValue) !== -1);

                var matchesDept    = !selectedDepartment || course.department === selectedDepartment;
                var matchesSem     = !selectedSemester   || String(course.semester) === selectedSemester;
                var matchesCredits = !selectedCredits    || String(course.credits)  === selectedCredits;

                return matchesSearch && matchesDept && matchesSem && matchesCredits;
            });

            renderCourses(filtered);
        }


        function renderCourses(courses) {
            if (!courses.length) {
                container.innerHTML = "";
                emptyState.classList.remove("hidden");
                return;
            }

            emptyState.classList.add("hidden");

            container.innerHTML = courses.map(function (c) {
                var isFull = (parseInt(c.registered || 0, 10) >= parseInt(c.capacity || 0, 10));

                return "<article class=\"course-card\">" +
                    "<div class=\"course-top\">" +
                    "<span class=\"course-code\">" + UI.escapeHtml(c.course_code || "") + "</span>" +
                    "<span class=\"badge" + (isFull ? " danger" : "") + "\">" +
                    (c.registered || 0) + "/" + (c.capacity || 0) +
                    "</span>" +
                    "</div>" +
                    "<h3 class=\"course-name\">" + UI.escapeHtml(c.title || "") + "</h3>" +
                    "<p class=\"course-meta\">👤 " + UI.escapeHtml(c.instructor || "N/A") + "</p>" +
                    "<p class=\"course-meta\">🕐 " + UI.escapeHtml(c.schedule_info || "N/A") + "</p>" +
                    "<p class=\"course-meta\">🎓 " + (c.credits || 0) + " credits</p>" +
                    "<div class=\"course-actions\">" +
                    "<button class=\"btn btn-primary btn-sm\" data-register=\"" + c.id + "\"" +
                    (isFull ? " disabled" : "") + ">" +
                    (isFull ? "Full" : "Register") +
                    "</button>" +
                    "</div>" +
                    "</article>";
            }).join("");

            attachRegisterEvents();
        }


        function attachRegisterEvents() {
            container.querySelectorAll("[data-register]").forEach(function (button) {
                button.addEventListener("click", function () {
                    var courseId = button.dataset.register;

                    button.disabled    = true;
                    button.textContent = "Registering...";

                    fetch("../php/register_course.php?course_id=" + courseId)
                        .then(function (response) { return response.json(); })
                        .then(function (result) {
                            if (result.success) {
                                UI.toast("Course registered successfully", "success");
                                location.reload();
                            } else {
                                UI.toast(result.message || "Registration failed.", "error");
                                button.disabled    = false;
                                button.textContent = "Register";
                            }
                        })
                        .catch(function () {
                            UI.toast("Registration failed.", "error");
                            button.disabled    = false;
                            button.textContent = "Register";
                        });
                });
            });
        }

    });

})();
