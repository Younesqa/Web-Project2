(function () {

    var role = localStorage.getItem("role");

    var isAdminPage = location.pathname.includes("/admin/");

    if (!role) {
        location.href = "../index.html";
        return;
    }
    if (!user || role !== "admin") {
        location.replace("../login.html");
    } else {
        document.body.style.display = "block";
    }
    if (isAdminPage && role !== "admin") {
        location.href = "../student/index.html";
    }

    if (!isAdminPage && role !== "student") {
        location.href = "../admin/index.html";
    }

})();
