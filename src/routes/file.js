const passport = require('passport');
const fileController = require('../controllers/file');
const { checkBlacklist } = require('../controllers/user');

function init(app) {

    app.post(
        '/file/upload',
        passport.authenticate('jwt', { session: false }),
        async (req, res) => {
            try {
                checkBlacklist(req.headers.authorization)
                const { dataValues } = await fileController.uploadFile(req.files.file)
                return res.send({
                    success: true,
                    payload: {
                        file: dataValues
                    }
                });
            } catch (err) {
                return res.status(400).send({ success: false, message: err.message });
            }
        }
    );

    app.delete(
        '/file/delete/:id',
        passport.authenticate('jwt', { session: false }),
        async (req, res) => {
            try {
                checkBlacklist(req.headers.authorization)
                await fileController.deleteFile(req.params.id)
                return res.send({
                    success: true,
                });
            } catch (err) {
                return res.status(500).send({ success: false, message: err.message });
            }
        }
    );

    app.get(
        '/file/download/:id',
        passport.authenticate('jwt', { session: false }),
        async (req, res) => {
            try {
                checkBlacklist(req.headers.authorization)
                const { content, mimetype, title } = await fileController.getFile(req.params.id);
               
                res.setHeader('Content-disposition', `attachment; filename=${title}`);
                res.set('Content-Type', `${mimetype}`);

                return res.send(
                    content
                );
            } catch (err) {
                return res.status(500).send({ success: false, message: err.message });
            }
        }
    );

    app.put(
        '/file/update/:id',
        passport.authenticate('jwt', { session: false }),
        async (req, res) => {
            try {
                checkBlacklist(req.headers.authorization)
                await fileController.updateFile(req.params.id, req.files.file);

                return res.send({
                    success: true
                });
            } catch (err) {
                return res.status(400).send({ success: false, message: err.message });
            }
        }
    );

    app.get(
        '/file/list',
        passport.authenticate('jwt', { session: false }),
        async (req, res) => {
            try {
                checkBlacklist(req.headers.authorization)
                const files = await fileController.getFileList(req.body);
                return res.send({
                    success: true,
                    payload: {
                        files
                    }
                });
            } catch (err) {
                return res.status(400).send({ success: false, message: err.message });
            }
        }
    );

    app.get(
        '/file/:id',
        passport.authenticate('jwt', { session: false }),
        async (req, res) => {
            try {
                checkBlacklist(req.headers.authorization)
                const file = await fileController.getFileInf(req.params.id)
                return res.send({
                    success: true,
                    payload: {
                        file
                    }
                });
            } catch (err) {
                return res.status(400).send({ success: false, message: err.message });
            }
        }
    );

}

module.exports = init;