(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        var list    = document.getElementById("reg-list");
        var empty   = document.getElementById("reg-empty");
        var totalEl = document.getElementById("total-credits");

        function render() {
            fetch("../php/my_courses.php")
                .then(function (response) {
                    if (response.status === 401) {
                        localStorage.clear();
                        window.location.href = "../index.html";
                        return null;
                    }
                    return response.json();
                })
                .then(function (courses) {
                    if (!courses) { return; }

                    if (!Array.isArray(courses) || courses.length === 0) {
                        list.innerHTML = "";
                        empty.classList.remove("hidden");
                        totalEl.textContent = "0";
                        return;
                    }

                    var total = courses.reduce(function (sum, c) {
                        return sum + parseInt(c.credits || 0, 10);
                    }, 0);

                    totalEl.textContent = total;
                    empty.classList.add("hidden");

                    list.innerHTML = courses.map(function (c) {

                        var prereqLine = "";
                        if (Array.isArray(c.prerequisites) && c.prerequisites.length > 0) {
                            prereqLine =
                                "<p class=\"course-meta\">📋 Prerequisites: " +
                                UI.escapeHtml(c.prerequisites.join(", ")) +
                                "</p>";
                        }

                        return "<article class=\"course-card\">" +
                            "<div class=\"course-top\">" +
                            "<span class=\"course-code\">" + UI.escapeHtml(c.course_code) + "</span>" +
                            "<span class=\"badge success\">Enrolled</span>" +
                            "</div>" +
                            "<h3 class=\"course-name\">" + UI.escapeHtml(c.title) + "</h3>" +
                            "<p class=\"course-meta\">👤 " + UI.escapeHtml(c.instructor) + "</p>" +

                            "<p class=\"course-meta\">🕐 " + UI.escapeHtml(c.schedule_info || "") + " · " + c.credits + " credits</p>" +
                            "<p class=\"course-meta\">🏷️ " + UI.escapeHtml(c.department) + " · " + UI.escapeHtml(c.semester) + "</p>" +
                            prereqLine +
                            "<div class=\"course-actions\">" +
                            "<button class=\"btn btn-outline btn-sm\" data-drop=\"" + c.id + "\">Drop course</button>" +
                            "</div>" +
                            "</article>";
                    }).join("");

                    list.querySelectorAll("[data-drop]").forEach(function (button) {
                        button.onclick = function () {
                            var courseId = button.dataset.drop;
                            var course   = null;

                            for (var i = 0; i < courses.length; i++) {
                                if (courses[i].id == courseId) {
                                    course = courses[i];
                                    break;
                                }
                            }

                            UI.confirmDialog(
                                "Drop " + course.course_code + " — " + course.title + "? This cannot be undone."
                            ).then(function (ok) {
                                if (!ok) { return; }

                                fetch("../php/drop_course.php?course_id=" + courseId)
                                    .then(function (response) { return response.json(); })
                                    .then(function (result) {
                                        if (result.success) {
                                            UI.toast("Course dropped successfully", "success");
                                            render();
                                        } else {
                                            UI.toast(result.message || "Failed to drop course.", "error");
                                        }
                                    });
                            });
                        };
                    });
                })
                .catch(function (error) {
                    console.error(error);
                    UI.toast("Failed to load registered courses", "error");
                });
        }

        render();
    });

})();
