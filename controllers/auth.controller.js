const db = require('../models');
const User = db.user;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const maxAge = 86400;
const tokenSecret = process.env.TOKEN_SECRET || 'secret';

const createToken = (id) => {
    return jwt.sign({ id: id }, tokenSecret, {
        expiresIn: maxAge
    });
}

module.exports.signUp = async (req, res) => {
    const { email, password, firstname, lastname, role } = req.body;
    

    // Validation des données
    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });
        res.status(201).json({ user: user.id });
    }
    catch (err) {
        res.status(500).send({ error: err.message});
    }
}

module.exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) {
            return res.status(401).json({ error: { email: 'email incorrect !' } });
        }
        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) {
            return res.status(401).json({ error: { password: 'Mot de passe incorrect !' } });
        }
        const token = createToken(user.id);
        res.cookie('jwt', token, { httpOnly: true, maxAge });
        res.status(200).json({
            userId: user.id,
            token: token,
        });
        console.log('User id : ', user.id);
        console.log('Token : ', token);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).send({ message : 'Déconnexion réussie' }).end();
}