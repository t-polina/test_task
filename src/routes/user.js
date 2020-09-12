const passport = require('passport');
const { createUser,
    checkBlacklist,
    addInBlacklist } = require('../controllers/user');
const jwt = require('jsonwebtoken');
const db = require('../db');

const expiresIn = process.env.EXPIRATION;
const secret = process.env.SECRET;

function init(app) {

    app.post('/signin', (req, res) => passport.authenticate('signin', { session: true }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).send({
                success: false,
                message: info ? info.message : 'Login failed',
                user,
            });
        }
        return req.login(user, { session: false }, async err => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: err.message,
                });
            }
            const token = jwt.sign({ id: user.id, refreshToken: user.refreshToken }, secret, { expiresIn });
            return res.json({ token: `Bearer ${token}` });
        });
    })(req, res));


    app.post('/signin/new_token',
        async (req, res) => {
            try {
                const refreshToken = req.headers.refresh
                const tokenData = jwt.verify(refreshToken, secret);
                const user = await db.models.User.findByPk(tokenData.id);

                if (user) {
                    const token = jwt.sign({ id: tokenData.id, refreshToken }, secret, { expiresIn });
                    return res.send({
                        success: true,
                        payload: {
                            token: `Bearer ${token}`
                        }
                    })
                }
                else {
                    return res.status(401).send({
                        success: false,
                        message: 'Incorrect refresh token'
                    });
                }
            } catch (err) {
                return res.status(500).send({ success: false, message: err.message });
            }
        }
    );

    app.post(
        '/signup',
        async (req, res) => {
            try {
                const { id, password } = req.body;
                if (!id || !password) {
                    return res.status(400).send({ success: false, message: 'Incorrect user data' });
                }
                const { refreshToken, token } = await createUser(id, password);
                return res.send({
                    success: true,
                    payload: {
                        refreshToken,
                        token: `Bearer ${token}`
                    }
                })
            } catch (err) {
                return res.status(500).send({ success: false, message: err.message });
            }
        }
    );

    app.get(
        '/info',
        passport.authenticate('jwt', { session: false }),
        async (req, res) => {
            try {
                await checkBlacklist(req.headers.authorization)
                return res.send({
                    success: true,
                    payload: {
                        id: req.user.id,
                    },
                });
            } catch (err) {
                return res.status(401).send({ success: false, message: err.message });
            }
        }
    );

    app.get(
        '/logout',
        passport.authenticate('jwt', { session: false }),
        async (req, res) => {
            try {
                addInBlacklist(req.headers.authorization);
                const { id, refreshToken } = req.user;
                const token = await jwt.sign({ id, refreshToken }, secret, { expiresIn });
                return res.send({
                    success: true,
                    payload: {
                        token: `Bearer ${token}`
                    }
                });
            } catch (err) {
                return res.status(500).send({ success: false, message: err.message });
            }
        }
    );

}

module.exports = init;