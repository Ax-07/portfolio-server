const jwt = require('jsonwebtoken');
const { User } = require('../models');

const checkAdmin = async (req, res, next) => {
    const token = req.cookies.jwt;
    try {
        if (token) {
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
            const userId = decodedToken.id; console.log(userId);
            const user = await User.findByPk(userId);
            if (!user || user.role !== 'admin') {
                throw new Error('Invalid user ID');
            }
            res.locals.admin = user;
            req.auth = { userId };
        } else {
            res.locals.admin = null;
        }
        next();
    } catch {
        res.status(401).json({ error: new Error('Invalid request!') });
    }
}

const requireAdminAuth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (token) {
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
            const user = await User.findByPk(decodedToken.id);
            if (!user || user.role !== 'admin') {
                throw Error('Utilisateur non trouvé');
            }
            res.locals.admin = user;
            next();
        } else {
            res.locals.admin = null;
            res.redirect('/');
        }
    } catch (err) {
        res.locals.admin = null;
        res.clearCookie('jwt');
        res.redirect('/');
        console.log('err', err);
    }
};

module.exports = { checkAdmin, requireAdminAuth };