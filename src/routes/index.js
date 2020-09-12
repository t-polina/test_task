
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');

const jsonParser = bodyParser.json();

const initFiles = require('./file');
const initUser = require('./user');
const initAuthService= require('../services/auth');

function init(app) {
    app.use(fileUpload({createParentPath: true }));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use('/', jsonParser, async (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Request-Method', '*');
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('Access-Control-Expose-Headers', '*');
        if (req.method === 'OPTIONS') {
            return res.send();
        }
        return next();
    });

    initAuthService(app);
    initFiles(app);
    initUser(app);
}

module.exports = init;
