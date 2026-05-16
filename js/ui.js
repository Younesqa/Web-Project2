(function (global) {
    "use strict";

    var STUDENT_NAV = [
        { href: "index.html", label: "Dashboard" },
        { href: "courses.html", label: "Courses" },
        { href: "registered.html", label: "Registered" }
    ];

    var ADMIN_NAV = [
        { href: "index.html", label: "Dashboard" },
        { href: "courses.html", label: "Courses" },
        { href: "prerequisites.html", label: "Prerequisites" },
        { href: "overview.html", label: "Overview" },
        { href: "registrations.html", label: "Registrations" }
    ];

    function escapeHtml(s) {
        return String(s != null ? s : "").replace(/[&<>"']/g, function (c) {
            var map = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };
            return map[c];
        });
    }

    function currentFile() {
        var parts = location.pathname.split("/");
        var last = parts[parts.length - 1] || "index.html";
        if (!last.endsWith(".html")) {
            last = "index.html";
        }
        return last;
    }

    function relativeToRoot(file) {
        var isNested = /\/(student|admin)\//.test(location.pathname);
        return (isNested ? "../" : "") + file;
    }

    function renderShell() {
        var slot = document.querySelector("[data-shell]");
        if (!slot) {
            return;
        }

        var role = slot.getAttribute("data-shell");
        var title = slot.getAttribute("data-title") || "App";
        var nav = role === "admin" ? ADMIN_NAV : STUDENT_NAV;
        var user = Store.getUser();
        var here = currentFile();

        var navLinks = nav.map(function (n) {
            return "<a href=\"" + n.href + "\" class=\"" +
                (n.href === here ? "is-active" : "") + "\">" +
                escapeHtml(n.label) + "</a>";
        }).join("");

        var userBlock = user
            ? "<div class=\"who\"><p>" + escapeHtml(user.name) +
            "</p><p class=\"role\">" + escapeHtml(user.role) + "</p></div>"
            : "";

        slot.outerHTML =
            "<header class=\"app-header\">" +
            "<div class=\"app-header-inner\">" +
            "<a class=\"brand\" href=\"index.html\">" +
            "<span class=\"brand-badge\">🎓</span>" +
            "<span>" + escapeHtml(title) + "</span>" +
            "</a>" +
            "<nav class=\"app-nav\">" + navLinks + "</nav>" +
            "<div class=\"user-block\">" +
            userBlock +
            "<button class=\"btn btn-ghost btn-sm\" id=\"logout-btn\">Logout</button>" +
            "</div>" +
            "</div>" +
            "</header>";

        var logoutBtn = document.getElementById("logout-btn");
        if (logoutBtn) {
            logoutBtn.onclick = function () {
                localStorage.clear();
                fetch(relativeToRoot("php/logout.php"))
                    .catch(function () { })
                    .finally(function () {
                        window.location.replace(relativeToRoot("index.html"));
                    });
            };
        }
    }

    function toast(msg, type) {
        type = type || "default";
        var root = document.getElementById("toast-root");
        if (!root) {
            console.log("[toast]", msg);
            return;
        }
        var t = document.createElement("div");
        t.className = "toast " + (type === "success" ? "success" : type === "error" ? "error" : "");
        t.textContent = msg;
        root.appendChild(t);
        setTimeout(function () {
            t.style.transition = "opacity .25s, transform .25s";
            t.style.opacity = "0";
            t.style.transform = "translateY(6px)";
            setTimeout(function () {
                t.remove();
            }, 260);
        }, 2600);
    }

    function openModal(id) {
        var m = document.getElementById(id);
        if (!m) {
            return;
        }
        m.classList.remove("hidden");
        m.querySelectorAll("[data-close]").forEach(function (el) {
            el.onclick = function () {
                closeModal(id);
            };
        });
        function escClose(e) {
            if (e.key === "Escape") {
                closeModal(id);
                document.removeEventListener("keydown", escClose);
            }
        }
        document.addEventListener("keydown", escClose);
    }

    function closeModal(id) {
        var m = document.getElementById(id);
        if (m) {
            m.classList.add("hidden");
        }
    }

    function confirmDialog(message) {
        return new Promise(function (resolve) {
            var modal = document.getElementById("confirm-modal");
            if (!modal) {
                resolve(window.confirm(message));
                return;
            }
            document.getElementById("confirm-text").textContent = message;
            openModal("confirm-modal");
            var yes = document.getElementById("confirm-yes");
            function cleanup(val) {
                closeModal("confirm-modal");
                yes.removeEventListener("click", onYes);
                modal.querySelectorAll("[data-close]").forEach(function (el) {
                    el.removeEventListener("click", onNo);
                });
                resolve(val);
            }
            function onYes() { cleanup(true); }
            function onNo() { cleanup(false); }
            yes.addEventListener("click", onYes);
            modal.querySelectorAll("[data-close]").forEach(function (el) {
                el.addEventListener("click", onNo);
            });
        });
    }

    global.UI = {
        renderShell: renderShell,
        toast: toast,
        openModal: openModal,
        closeModal: closeModal,
        confirmDialog: confirmDialog,
        escapeHtml: escapeHtml,
        relativeToRoot: relativeToRoot
    };

    document.addEventListener("DOMContentLoaded", renderShell);

})(window);
