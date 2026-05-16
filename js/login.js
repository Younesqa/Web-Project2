(function () {
    "use strict";

    var savedRole = localStorage.getItem("role");
    var savedUser = localStorage.getItem("user");

    if (savedRole && savedUser) {
        try {
            JSON.parse(savedUser);
            location.replace(
                savedRole === "admin"
                    ? "admin/index.html"
                    : "student/index.html"
            );
            return;
        } catch (e) {
            localStorage.clear();
        }
    }

    var role = "student";

    var roleBtns = document.querySelectorAll(".role-btn");
    var usernameInput = document.getElementById("username");
    var passwordInput = document.getElementById("password");
    var form = document.getElementById("login-form");
    var submit = document.getElementById("login-submit");
    var alertBox = document.getElementById("login-alert");

    roleBtns.forEach(function (button) {
        button.onclick = function () {
            role = button.dataset.role;
            roleBtns.forEach(function (b) {
                b.classList.toggle("is-active", b === button);
            });
        };
    });

    function showFieldError(name, msg) {
        var errorEl = document.querySelector("[data-error=\"" + name + "\"]");
        if (errorEl) {
            errorEl.textContent = msg || "";
        }
        var input = document.getElementById(name);
        if (input) {
            input.classList.toggle("invalid", !!msg);
        }
    }

    function showAlert(msg) {
        if (!msg) {
            alertBox.classList.add("hidden");
            alertBox.textContent = "";
            return;
        }
        alertBox.classList.remove("hidden");
        alertBox.textContent = msg;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        showAlert("");

        var username = usernameInput.value.trim();
        var password = passwordInput.value;
        var bad = false;

        if (!username) {
            showFieldError("username", "Username is required");
            bad = true;
        } else {
            showFieldError("username", "");
        }

        if (!password) {
            showFieldError("password", "Password is required");
            bad = true;
        } else {
            showFieldError("password", "");
        }

        if (bad) {
            return;
        }

        submit.disabled = true;
        submit.textContent = "Signing in...";

        console.log({ username: username, password: password, role: role });

        fetch("php/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                password: password,
                role: role
            })
        })
            .then(function (response) {
                return response.text();
            })
            .then(function (text) {
                console.log("Server Response:", text);

                var res = JSON.parse(text);

                submit.disabled = false;
                submit.textContent = "Sign in";

                if (!res.success) {
                    showAlert(res.message || "Login failed");
                    if (typeof UI !== "undefined") {
                        UI.toast(res.message || "Login failed", "error");
                    }
                    return;
                }

                localStorage.setItem("role", role);
                if (res.user) {
                    localStorage.setItem("user", JSON.stringify(res.user));
                }

                if (typeof UI !== "undefined") {
                    UI.toast("Welcome back!", "success");
                }

                location.href = role === "admin"
                    ? "admin/index.html"
                    : "student/index.html";
            })
            .catch(function (error) {
                submit.disabled = false;
                submit.textContent = "Sign in";

                console.error("Login Error:", error);
                showAlert("An unexpected error occurred.");

                if (typeof UI !== "undefined") {
                    UI.toast("An unexpected error occurred.", "error");
                }
            });
    });

})();
