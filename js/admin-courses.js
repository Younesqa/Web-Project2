(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        var tbody      = document.getElementById("course-tbody");
        var addBtn     = document.getElementById("add-course-btn");
        var form       = document.getElementById("course-form");
        var modalTitle = document.getElementById("modal-title");

        var editingId = null;
        var courses   = [];


        function loadCourses() {
            return fetch("../php/get_courses.php")
                .then(function (response) { return response.json(); })
                .then(function (data) {
                    courses = Array.isArray(data) ? data : [];
                });
        }


        function render() {
            tbody.innerHTML = courses.map(function (c) {
                return "<tr>" +
                    "<td><strong>" + UI.escapeHtml(c.course_code) + "</strong></td>" +
                    "<td>" + UI.escapeHtml(c.title) + "</td>" +
                    "<td>" + UI.escapeHtml(c.instructor) + "</td>" +
                    "<td>" + UI.escapeHtml(c.schedule_info) + "</td>" +
                    "<td>" + c.credits + "</td>" +
                    "<td>" + (c.registered || 0) + "/" + c.capacity + "</td>" +
                    "<td>" + UI.escapeHtml(c.department) + "</td>" +
                    "<td>" +
                    "<div class=\"row-actions\">" +
                    "<button class=\"btn btn-outline btn-sm\" data-edit=\"" + c.id + "\">Edit</button>" +
                    "<button class=\"btn btn-ghost btn-sm\" data-del=\"" + c.id + "\">Delete</button>" +
                    "</div>" +
                    "</td>" +
                    "</tr>";
            }).join("");

            tbody.querySelectorAll("[data-edit]").forEach(function (button) {
                button.onclick = function () { openEdit(button.dataset.edit); };
            });

            tbody.querySelectorAll("[data-del]").forEach(function (button) {
                button.onclick = function () { onDelete(button.dataset.del); };
            });
        }


        function openAdd() {
            editingId = null;
            modalTitle.textContent = "Add Course";
            form.reset();
            UI.openModal("course-modal");
        }


        function openEdit(id) {
            var course = null;
            for (var i = 0; i < courses.length; i++) {
                if (courses[i].id == id) { course = courses[i]; break; }
            }
            if (!course) { return; }

            editingId = id;
            modalTitle.textContent = "Edit Course";

            if (form.elements["course_code"])   form.elements["course_code"].value   = course.course_code   || "";
            if (form.elements["title"])         form.elements["title"].value         = course.title         || "";
            if (form.elements["description"])   form.elements["description"].value   = course.description   || "";
            if (form.elements["instructor"])    form.elements["instructor"].value    = course.instructor    || "";
            if (form.elements["schedule_info"]) form.elements["schedule_info"].value = course.schedule_info || "";
            if (form.elements["credits"])       form.elements["credits"].value       = course.credits       || "";
            if (form.elements["capacity"])      form.elements["capacity"].value      = course.capacity      || "";
            if (form.elements["department"])    form.elements["department"].value    = course.department    || "";
            if (form.elements["semester"])      form.elements["semester"].value      = course.semester      || "";

            UI.openModal("course-modal");
        }


        function onDelete(id) {
            var course = null;
            for (var i = 0; i < courses.length; i++) {
                if (courses[i].id == id) { course = courses[i]; break; }
            }
            if (!course) { return; }

            UI.confirmDialog("Delete " + course.course_code + " - " + course.title + "?")
                .then(function (ok) {
                    if (!ok) { return; }

                    return fetch("../php/delete_course.php?id=" + id)
                        .then(function (response) { return response.json(); })
                        .then(function (result) {
                            if (result.success) {
                                UI.toast("Course deleted", "success");
                                return loadCourses().then(render);
                            } else {
                                UI.toast(result.message || "Delete failed.", "error");
                            }
                        });
                });
        }


        form.addEventListener("submit", function (e) {
            e.preventDefault();

            var formData = new FormData(form);

            // Always POST; update_course.php reads id from GET or POST body.
            var url = editingId
                ? "../php/update_course.php?id=" + editingId
                : "../php/add_course.php";

            // Pass the id inside the form body so update_course.php can read it.
            if (editingId) {
                formData.append("id", editingId);
            }

            fetch(url, { method: "POST", body: formData })
                .then(function (response) { return response.json(); })
                .then(function (result) {
                    if (result.success) {
                        UI.toast(editingId ? "Course updated" : "Course added", "success");
                        UI.closeModal("course-modal");
                        return loadCourses().then(render);
                    } else {
                        UI.toast(result.message || "Save failed.", "error");
                    }
                })
                .catch(function (error) {
                    console.error(error);
                    UI.toast("An error occurred", "error");
                });
        });


        addBtn.onclick = openAdd;

        loadCourses()
            .then(render)
            .catch(function (error) {
                console.error(error);
                UI.toast("Failed to load courses", "error");
            });
    });

})();
