module.exports = function (app, model) {

    var bcrypt = require('bcrypt-nodejs');
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;

    var facebookConfig = {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'name', 'emails'],
        enableProof: true
    };

    passport.use(new LocalStrategy(localStrategy));
    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    app.post("/api/user", createUser);
    app.post("/api/login", passport.authenticate('local'), login);
    app.post("/api/logout", logout);
    app.post("/api/register", register);
    app.get("/api/loggedIn", loggedin);
    app.get('/api/isAdmin', isAdmin);
    app.get('/api/admin/users', findAllUsers);
    app.get('/api/users/:searchText', findUserMatches);
    app.post("/api/user/fave", addToFave);
    app.post("/api/user/fave/remove", removeFromFave);
    app.post("/api/user/fave/f", addToFaveF);
    app.post("/api/user/fave/remove/f", removeFromFaveF);

    app.get("/auth/facebook", passport.authenticate('facebook', {scope: ['public_profile', 'email']}));
    app.get("/auth/facebook/callback", passport.authenticate('facebook', {
            failureRedirect: '/#/login'
        }),
        function (req, res) {
            var redirectUrl = "/#/user/" + req.user._id.toString();
            res.redirect(redirectUrl);
        });

    app.get("/api/user", findUser);
    app.get("/api/user?username=username", findUserByUsername);
    app.get("/api/user?username=username&password=password", findUserByCredentials);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);

    function localStrategy(username, password, done) {
        // Need to first find by name and then validate password.
        // This is because the stored password is the encrypted one.
        // There could be more than one user with the same user name,
        // but ignoring that for now.
        model.findUserByUsername(username)
            .then(
                function (user) {
                    if (user) {
                        if (bcrypt.compareSync(password, user.password)) {
                            return done(null, user);
                        }
                        else {
                            return done(null, false, {message: "Incorrect password."});
                        }
                    }
                    else {
                        return done(null, false, {message: "No such user exists. Please register."});
                    }
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                });
    }

    function facebookStrategy(token, refreshToken, profile, done) {
        model.findUserByFacebookId(profile.id)
            .then(function (user) {
                if (user) {
                    return done(null, user);
                }
                else {
                    var email = profile.emails[0].value;
                    var emailParts = email.split("@");
                    var newUser = {
                        facebook: {
                            id: profile.id,
                            token: token
                        },

                        username: emailParts[0],
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: email
                    };
                    model.createUser(newUser)
                        .then(function (newUser) {
                                if (newUser) {
                                    return done(null, newUser);
                                }
                                else {
                                    return done(null, false, {message: "User not created."})
                                }
                            },
                            function (err) {
                                return done(err);
                            });
                }
            });
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        model.findUserById(user._id)
            .then(function (user) {
                    done(null, user);
                },
                function (err) {
                    done(err, null);
                });
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        res.send(200);
    }

    function register(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        model.createUser(user)
            .then(function (newUser) {
                if (newUser) {
                    req.login(newUser, function (err) {
                        if (err) {
                            res.sendStatus(400).send(err);
                        }
                        else {
                            res.json(newUser);
                        }
                    });
                }
            });
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function isAdmin(req, res) {
        var user = req.user;
        if (user.role === null || user.role === "ADMIN") {
            res.json(user);
        }
        else {
            res.send('0');
        }
    }

    function findUser(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        if (username && password) {
            findUserByCredentials(req, res);
        } else if (username) {
            findUserByUsername(req, res);
        }
    }

    function findUserMatches(req, res) {
        var searchText = req.params.searchText;
        model.findUserMatches(searchText)
            .then(function (users) {
                res.json(users);
            })
            .catch(function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function createUser(req, res) {
        var newUser = req.body;
        model.createUser(newUser)
            .then(function (user) {
                res.json(user);
            })
            .catch(function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        model.findUserByUsername(username)
            .then(function (user) {
                res.json(user);
            })
            .catch(function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        model.findUserByCredentials(username, password)
            .then(function (user) {
                res.json(user);
            })
            .catch(function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        model.findUserById(userId)
            .then(function (user) {
                res.json(user);
            })
            .catch(function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findAllUsers(req, res) {
        model.findAllUsers()
            .then(function (users) {
                res.json(users);
            })
            .catch(function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var newUser = req.body;
        model.updateUser(userId, newUser)
            .then(function (user) {
                res.json(user);
            })
            .catch(function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function deleteUser(req, res) {
        var userId = req.params.userId;
        model.deleteUser(userId)
            .then(function (user) {
                res.json(user);
            })
            .catch(function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function addToFave(req, res) {
        var bod = req.body;
        var name = bod.name;
        var id = bod.id;
        var bio = bod.bioguide;
        console.log("From server add to fave :" + name);
        console.log(id);
        model.addToFav(name, id, bio)
            .then(function (user) {
                res.json(user);
            })
            .catch(function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function removeFromFave(req, res) {
        var bod = req.body;
        var name = bod.name;
        var id = bod.id;
        var bio = bod.bioguide;
        console.log("Server service R" + bod.id);
        model.removeFromFav(name, id, bio)
            .then(function (user) {
                res.json(user);
            })
            .catch(function (error) {
                res.sendStatus(500).send(error);
            });
    }

    // var bod = {'name' : name, 'id' : vm.userId, 'fuserId' : id};
    function addToFaveF(req, res) {
        var bod = req.body;
        var name = bod.name;
        var id = bod.id;
        var fid = bod.fuserId;
        console.log("From server add to fave :" + name);
        console.log(id);
        model.addToFavF(name, id, fid)
            .then(function (user) {
                res.json(user);
            })
            .catch(function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function removeFromFaveF(req, res) {
        var bod = req.body;
        var name = bod.name;
        var id = bod.id;
        var fid = bod.fuserId;
        console.log("Server service R" + bod.id);
        model.removeFromFavF(name, id, fid)
            .then(function (user) {
                res.json(user);
            })
            .catch(function (error) {
                res.sendStatus(500).send(error);
            });
    }
};

