(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        // Populate the admin name from localStorage.
        var userData = localStorage.getItem("user");
        if (userData) {
            try {
                var user = JSON.parse(userData);
                if (user.name) {
                    document.getElementById("admin-name").textContent = user.name.split(" ")[0];
                }
            } catch (e) {
                // ignore parse error
            }
        }

        fetch("../php/get_stats.php")
            .then(function (response) {
                if (response.status === 401) {
                    localStorage.clear();
                    window.location.href = "../index.html";
                    return null;
                }
                if (!response.ok) {
                    throw new Error("get_stats.php returned status " + response.status);
                }
                return response.json();
            })
            .then(function (data) {
                if (!data) { return; }

                var stats = [
                    { label: "Courses",              value: data.courses       || 0, icon: "📚" },
                    { label: "Active students",      value: data.students      || 0, icon: "👥" },
                    { label: "Total registrations",  value: data.registrations || 0, icon: "✅" }
                ];

                document.getElementById("admin-stats").innerHTML =
                    stats.map(function (s) {
                        return "<div class=\"stat-card\">" +
                            "<div class=\"ic\">" + s.icon + "</div>" +
                            "<div>" +
                            "<div class=\"v\">" + s.value + "</div>" +
                            "<div class=\"l\">" + UI.escapeHtml(s.label) + "</div>" +
                            "</div>" +
                            "</div>";
                    }).join("");
            })
            .catch(function (error) {
                console.error(error);
                UI.toast("Failed to load dashboard data", "error");
            });
    });

})();
