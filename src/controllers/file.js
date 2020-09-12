const db = require('../db');
const uuid = require('uuid');
const fs = require('fs');

const getFindFilPath = id => {
    const files = fs.readdirSync('./files');
    const fileName = files.find(file => file.startsWith(id));
    return fileName && `files/${fileName}`
};

const getFileExtension = name => {
    const splittedFileName = name.split('.');
    return splittedFileName[splittedFileName.length - 1].toLowerCase();
};

const uploadFile = async ({ name, data, size, mimetype }) => {
    const id = uuid.v1();
    const path = `files/${id}-${name}`;
    const extension = getFileExtension(name);
    fs.writeFile(path, data, (err) => {
        if (err) throw err;
    })
    return db.models.File.create({ id, title: name, size, mimetype, extension })
};

const getFileList = async ({ list_size = 10, page = 1 }) => {
    let files = [];

    if (page === 1) {
        files = await db.sequelize.query(
            `SELECT *  FROM files LIMIT ${list_size}`, { type: db.sequelize.QueryTypes.SELECT });
    } else {
        const startRow = list_size * page - list_size;
        const endRow = list_size * page - 1;
        files = await db.sequelize.query(
            `SELECT *  FROM files LIMIT ${startRow}, ${endRow}`, { type: db.sequelize.QueryTypes.SELECT });
    }

    return files.map(file => {
        const path = getFindFilPath(file.id)
        return {
            ...file,
            path
        }
    })
};

const deleteFile = async id => {
    const path = getFindFilPath(id);
    if (path) {
        fs.unlink(path, err => {
            if (err) throw err;
        });
    }
    await db.models.File.destroy({ where: { id } })
};

const getFileInf = async id => {
    return db.models.File.findByPk(id);
};

const updateFile = async (id, { name, data, size, mimetype }) => {
    const extension =  getFileExtension(name);
    fs.unlink(getFindFilPath(id), err => {
        if (err) throw err;
    });
    const path = `files/${id}-${name}`;
    fs.writeFile(path, data, err => {
        if (err) throw err;
    });
    await db.models.File.update({ title: name, size, mimetype, extension }, { where: { id } });
};

const getFile = async id => {
    const { mimetype, title } = await db.models.File.findByPk(id);
    const content =  fs.readFileSync(getFindFilPath(id));
    return {
        content,
        mimetype,
        title
    }
};

module.exports = {
    uploadFile,
    getFileList,
    deleteFile,
    getFileInf,
    updateFile,
    getFile
};
