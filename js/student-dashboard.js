(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {

        var userData = localStorage.getItem("user");
        if (userData) {
            var user = JSON.parse(userData);
            if (user.name) {
                document.getElementById("student-name").textContent = user.name.split(" ")[0];
            }
        }

        fetch("../php/my_courses.php")
            .then(function (response) {
                if (response.status === 401) {
                    localStorage.clear();
                    window.location.href = "../index.html";
                    return;
                }


                if (!response.ok) {
                    throw new Error("my_courses.php returned status " + response.status);
                }
                return response.text();
            })
            .then(function (regText) {
                var registeredCourses;
                try {
                    registeredCourses = JSON.parse(regText);
                } catch (e) {
                    console.error("Invalid JSON from my_courses.php:", regText);
                    throw new Error("my_courses.php did not return valid JSON");
                }

                return fetch("../php/get_courses.php")
                    .then(function (response) {
                        if (!response.ok) {
                            throw new Error("get_courses.php returned status " + response.status);
                        }
                        return response.text();
                    })
                    .then(function (coursesText) {
                        var allCourses;
                        try {
                            allCourses = JSON.parse(coursesText);
                        } catch (e) {
                            console.error("Invalid JSON from get_courses.php:", coursesText);
                            throw new Error("get_courses.php did not return valid JSON");
                        }

                        var reg = Array.isArray(registeredCourses) ? registeredCourses : [];
                        var courses = Array.isArray(allCourses) ? allCourses : [];

                        var credits = reg.reduce(function (sum, course) {
                            return sum + parseInt(course.credits || 0, 10);
                        }, 0);

                        var available = courses.filter(function (course) {
                            return parseInt(course.registered || 0, 10) < parseInt(course.capacity || 0, 10);
                        }).length;

                        var stats = [
                            { label: "Registered Courses", value: reg.length, icon: "📚" },
                            { label: "Total Credits", value: credits, icon: "🎯" },
                            { label: "Available Courses", value: available, icon: "🗂️" }
                        ];

                        document.getElementById("student-stats").innerHTML = stats.map(function (s) {
                            return "<div class=\"stat-card\">" +
                                "<div class=\"ic\">" + s.icon + "</div>" +
                                "<div>" +
                                "<div class=\"v\">" + s.value + "</div>" +
                                "<div class=\"l\">" + UI.escapeHtml(s.label) + "</div>" +
                                "</div>" +
                                "</div>";
                        }).join("");
                    });
            })
            .catch(function (error) {
                console.error("Dashboard Error:", error);
                UI.toast("Failed to load dashboard data", "error");
            });

    });

})();
