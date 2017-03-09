/**
 * Created by Ahrimaan on 07.01.2017.
 */
var userMdl = require('./userModel');
var bcrypt = require('bcrypt-nodejs');
var localStrategy = require('passport-local').Strategy;
var passport = require('passport');

var ctrl = {}

passport.use(new localStrategy({ usernameField: 'userId', passwordField: 'password' }, (username, password, done) => {
    LoginUser(username, password, done);
}));

function CreateOrUpdateUser(user, done) {
    userMdl.findOne({ id: user.id }, (err, dbUser) => {
        if (dbUser) {
            done(null,dbUser);
        }
        else {
            var newMdl = new userMdl();
            newMdl.id = user.id;
            newMdl.fullName = user.displayName;
            newMdl.isSocial = true;
            if (user.photos) {
                newMdl.avatarUrl = user.photos[0].value;
            }
            newMdl.save((err, result) => {
                done(null, result);
            });
        }
    });
}

function LoginUser(username, password, done) {
    userMdl.findOne({ id: username }, (err, dbUser) => {
        if (err || !dbUser) {
            return done((err || 'User not found'), null);
        }

        var result = bcrypt.compareSync(password, dbUser.passwordHash);
        if (!result) {
            return done('Password missmatch', null)
        }

        return done(null, dbUser.toJSON());
    })
};

function createLocalUser(req, resp, next) {
    userMdl.findOne({ userId: req.body.username }, (err, user) => {
        if (err) {
            return resp.sendStatus(500);
        }
        if (user) {
            resp.status(302);
            return resp.send('User already exsist');
        }
        bcrypt.hash(req.body.password, null, null, function (err, hash) {
            if (err) {
                resp.status = 500;
                return resp.send(err);
            }

            var user = new userMdl();
            user.fullName = req.body.fullName;
            user.name = req.body.username;
            user.isSocial = false;
            user.id = req.body.username;
            user.passwordHash = hash;

            user.save((err, result) => {
                if (err) {
                    resp.status = 500;
                    resp.send(err);
                }
                return resp.send(200);
            });
        });
    });

}

function logOut(req,res,next){
       req.logOut();
       req.session.destroy();
       return res.sendStatus(200);
    };

function getUser(req, res, next) {
    var userId = req.params.id;
    if (userId === undefined || userId === "undefined") {
        return res.sendStatus(401);
    }
    userMdl.findOne({ id: userId }, (err, usr) => {
        if (err) {
            return res.status(500).send(err);
        }
        usr.passwordHash = undefined;
        return res.send(usr);
    });
}

function authLocal(req, res, next) {
    passport.authenticate('local', (err, account) => {
        req.login(account, () => {
            if (account) {
                account.passwordHash = undefined;
            }
            res.status(err ? 500 : 200).send(err ? err : account);
        });
    })(req, res, next);
};

passport.serializeUser(function (user, done) {
    CreateOrUpdateUser(user, done);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

ctrl.CreateOrUpdateUser = CreateOrUpdateUser;
ctrl.LoginLocalUser = LoginUser;
ctrl.CreateLocalUser = createLocalUser;
ctrl.authLocal = authLocal;
ctrl.getUser = getUser;
ctrl.logOut = logOut;
module.exports = ctrl;