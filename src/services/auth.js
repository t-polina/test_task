const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const db =require('../db')

function init(app) {

    app.use(passport.initialize());

    passport.use('signin', new LocalStrategy({ usernameField: 'id', passwordField: 'password' },
        async (id, password, callback) => {
            const user = await db.models.User.findByPk(id);
            if (user) {
                const validate = user.isValidPassword(password);
                if (!validate) {
                    return callback(null, false, { message: 'Incorrect password' });
                }
                return callback(null, user.toJSON(), { message: 'Logged in successfully' });
            }
            return callback(null, false, { message: 'Incorrect login' });
        }
    ));

    passport.use('jwt', new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRET,
        },
        async (jwtPayload, callback) => {
            const user = await db.models.User.findByPk(jwtPayload.id);
            if (user) {
                return callback(null, user);
            }
            return callback(new Error('User not found'));
        },
    ));
}

module.exports = init;