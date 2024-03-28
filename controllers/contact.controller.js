const nodemailer = require('nodemailer');

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
};

exports.sendMailFromUser = async (req, res) => {
    const {name , email, message} = req.body;
    console.log(req.body);
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: `Message de ${name}`,
            text: message
        };
        await transporter.sendMail(mailOptions);

        // Envoi d'un mail de confirmation à l'utilisateur
        const confirmationMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Confirmation de réception de votre message`,
            html: 
            `<p>Bonjour ${name},</p>
             <p>Nous avons bien reçu votre message. Nous vous répondrons dans les plus brefs délais. Merci.</p>
             <p>A bientôt</p>
            `
        };
        await transporter.sendMail(confirmationMailOptions);

        res.status(200).json({ message: `Email envoyé avec succès. de ${email} à ${process.env.EMAIL_USER}` });
    } catch (err) {
        res.status(500).json({ message: err });
    }
}

exports.sendMailToUser = async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: req.body.email,
            subject: `Message de ${req.body.name}`,
            text: req.body.message
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email envoyé avec succès.' });
    } catch (err) {
        res.status(500).json({ message: err });
    }
}

