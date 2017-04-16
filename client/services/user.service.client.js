(function () {
    angular
        .module("CongressTracker")
        .factory("UserService", UserService);

    function UserService($http) {

        var api = {
            "createUser": createUser,
            "login": login,
            "logout": logout,
            "findUserById": findUserById,
            "findUserByUsername": findUserByUsername,
            "findUserByCredentials": findUserByCredentials,
            "updateUser": updateUser,
            "deleteUser": deleteUser,
            "register": register,
            "removeFromFave" : removeFromFave,
            "addToFave" : addToFave
        };
        return api;

        function createUser(user) {
            return $http.post("/api/user", user);
        }

        function login(user) {
            return $http.post("/api/login", user);
        }

        function logout() {
            return $http.post("/api/logout");
        }

        function register(user) {
            return $http.post("/api/register", user);
        }

        function findUserById(userId) {
            return $http.get("/api/user/" + userId)
        }

        function findUserByUsername(username) {
            return $http.get("/api/user?username=" + username);
        }

        function findUserByCredentials(username, password) {
            return $http.get("/api/user?username=" + username + "&password=" + password);
        }

        function updateUser(userId, user) {
            return $http.put("/api/user/" + userId, user);
        }

        function deleteUser(userId) {
            return $http.delete("/api/user/" + userId);
        }

        function removeFromFave(bod){
            console.log("From client server "+ JSON.stringify(bod));
            return $http.post("/api/user/fave/remove", bod);
        }

        function addToFave(bod){
            console.log("From slient service "+ bod);
            return $http.post("/api/user/fave/", bod);
        }
    }
})();