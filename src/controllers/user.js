const db = require('../db');
const jwt = require('jsonwebtoken');

const createUser = async (id, password) => {
    const expiresIn = process.env.EXPIRATION;
    const secret = process.env.SECRET;
    const refreshToken = jwt.sign({ id }, secret);
    const token = jwt.sign({ id, refreshToken }, secret, { expiresIn });

    await db.models.User.create({ id, password, refreshToken })

    return {
        refreshToken,
        token
    }
}

const checkBlacklist = async token => {
    const isToken = await db.models.Blacklist.findOne({ where: { token }, raw: true })
    if (isToken) throw new Error('Invalid token')
}

const addInBlacklist = async token => {
    return db.models.Blacklist.create({ token })
}

module.exports = {
    createUser,
    checkBlacklist,
    addInBlacklist
};
