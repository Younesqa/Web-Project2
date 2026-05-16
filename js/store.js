var Store = {

    getUser: function () {
        var user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    },

    getRole: function () {
        return localStorage.getItem("role");
    },

    setUser: function (user) {
        localStorage.setItem("user", JSON.stringify(user));
    },

    setRole: function (role) {
        localStorage.setItem("role", role);
    },

    clear: function () {
        localStorage.removeItem("user");
        localStorage.removeItem("role");
    }

};
