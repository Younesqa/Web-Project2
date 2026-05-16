(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        var courseSel = document.getElementById("prq-course");
        var addSel    = document.getElementById("prq-add");
        var addBtn    = document.getElementById("prq-add-btn");
        var list      = document.getElementById("prq-list");
        var empty     = document.getElementById("prq-empty");

        var courses = [];


        function loadCourses() {
            return fetch("../php/get_courses.php")
                .then(function (response) { return response.json(); })
                .then(function (data) {
                    courses = Array.isArray(data) ? data : [];
                });
        }


        function fillCourses() {
            courseSel.innerHTML = courses.map(function (course) {
                return "<option value=\"" + course.id + "\">" +
                    UI.escapeHtml(course.course_code) + " — " +
                    UI.escapeHtml(course.title) +
                    "</option>";
            }).join("");
        }


        function fillAddOptions() {
            var currentId = courseSel.value;

            var options = courses.filter(function (course) {
                return String(course.id) !== String(currentId);
            });

            addSel.innerHTML = options.map(function (course) {
                return "<option value=\"" + course.id + "\">" +
                    UI.escapeHtml(course.course_code) + " — " +
                    UI.escapeHtml(course.title) +
                    "</option>";
            }).join("");

            addBtn.disabled = options.length === 0;
        }


        function renderList() {
            var courseId = courseSel.value;

            if (!courseId) {
                list.innerHTML = "";
                empty.classList.remove("hidden");
                return;
            }

            fetch("../php/prerequisites.php?course_id=" + courseId)
                .then(function (response) { return response.json(); })
                .then(function (prereqs) {
                    if (!Array.isArray(prereqs) || prereqs.length === 0) {
                        list.innerHTML = "";
                        empty.classList.remove("hidden");
                        return;
                    }

                    empty.classList.add("hidden");

                    list.innerHTML = prereqs.map(function (p) {
                        return "<li class=\"chip\">" +
                            UI.escapeHtml((p.prereq_code || "") + " — " + (p.prereq_title || "")) +
                            "<button data-remove=\"" + p.id + "\" aria-label=\"Remove\">×</button>" +
                            "</li>";
                    }).join("");

                    list.querySelectorAll("[data-remove]").forEach(function (button) {
                        button.onclick = function () {
                            var prerequisiteId = button.dataset.remove;

                            UI.confirmDialog("Remove this prerequisite?")
                                .then(function (ok) {
                                    if (!ok) { return; }

                                    return fetch("../php/delete_prerequisite.php?id=" + prerequisiteId)
                                        .then(function (response) { return response.json(); })
                                        .then(function (result) {
                                            if (result.success) {
                                                UI.toast("Prerequisite removed", "success");
                                                renderList();
                                            } else {
                                                UI.toast(result.message || "Remove failed.", "error");
                                            }
                                        });
                                });
                        };
                    });
                });
        }


        addBtn.onclick = function () {
            var courseId       = courseSel.value;
            var prerequisiteId = addSel.value;

            if (!courseId || !prerequisiteId) { return; }

            var formData = new FormData();
            formData.append("course_id", courseId);
            formData.append("prerequisite_course_id", prerequisiteId);

            fetch("../php/add_prerequisite.php", { method: "POST", body: formData })
                .then(function (response) { return response.json(); })
                .then(function (result) {
                    if (result.success) {
                        UI.toast("Prerequisite added", "success");
                        renderList();
                    } else {
                        UI.toast(result.message || "Add failed.", "error");
                    }
                });
        };


        courseSel.onchange = function () {
            fillAddOptions();
            renderList();
        };


        loadCourses()
            .then(function () {
                fillCourses();
                fillAddOptions();
                renderList();
            })
            .catch(function (error) {
                console.error(error);
                UI.toast("Failed to load courses", "error");
            });
    });

})();
