const express = require('express');
const app = express(); // Création d'une nouvelle application express
const path = require('path'); // Importation du module path pour gérer les chemins de fichiers
const cors = require('cors'); // Importation du module cors pour gerer les origines
const cookieParser = require('cookie-parser'); // Importation du module cookie-parser pour gérer les cookies
require('dotenv').config({ path: ".env"});


const whitelist = [
  process.env.URL_LOCAL,
  process.env.URL_ORIGIN,
  process.env.URL_ORIGIN_2,
]; // Liste blanche des origines autorisées
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }, // Origines autorisées
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
  credentials: true // Autorise les cookies
};
app.use(cors(corsOptions)); // Configuration de l'application pour utiliser le module cors
app.use(express.json()); // Configuration de l'application pour utiliser le format JSON
app.use(express.urlencoded({ extended: true })); // Configuration de l'analyseur de corps de requête pour analyser les requêtes en format JSON
app.use(express.static(path.join(__dirname, "public"))); // Configuration du dossier static pour servir les fichiers statiques
app.use(cookieParser()); // Configuration de l'application pour utiliser le module cookie-parser

const db = require("./models"); // Importation du modèle de la base de données
db.sequelize.sync().then(()=> console.log('db synchronisé')); // Synchronisation du modèle avec la base de données

// Importation des routes
const authRoute = require('./routes/auth.routes');
app.use('/api/auth', authRoute); // Configuration de l'application pour utiliser les routes de auth
const todoRoute = require('./routes/todo.routes');
app.use('/api/todo',todoRoute); // Configuration de l'application pour utiliser les routes de todo
const figureRoute = require('./routes/figure.routes');
app.use('/api/figure', figureRoute); // Configuration de l'application pour utiliser les routes de figure
const convertPictureRoute = require('./routes/convertPicture.routes');
app.use('/api', convertPictureRoute); // Configuration de l'application pour utiliser les routes de convertPicture
const projetRoute = require('./routes/projet.routes');
app.use('/api/projet', projetRoute); // Configuration de l'application pour utiliser les routes de projet
const categorieRoute = require('./routes/categorie.routes');
app.use('/api/categorie', categorieRoute); // Configuration de l'application pour utiliser les routes de categorie
const stackRoute = require('./routes/stack.routes');
app.use('/api/stack', stackRoute); // Configuration de l'application pour utiliser les routes de stack
const contactRoute = require('./routes/contact.routes');

app.use('/api/contact', contactRoute); // Configuration de l'application pour utiliser les routes de contact
const siteMap = require('./routes/siteMap.routes');
app.use(siteMap); // Configuration de l'application pour utiliser les routes de siteMap

// Route pour obtenir l'identifiant de l'utilisateur depuis son token
const { requireAdminAuth } = require('./middlewares/Auth.middleware');
app.get('/jwtid', requireAdminAuth, (req, res) => {
  res.status(200).send({_id : res.locals.admin._id, token : req.cookies.jwt});
});

// Swagger API documentation
// const swaggerUi = require('swagger-ui-express'); // Importation du module swagger-ui-express
// const yaml = require('yamljs'); // Importation du module yamljs
// const swaggerDocs = yaml.load('swagger.yaml'); // Importation du fichier swagger.yaml
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Configuration de swagger-ui-express pour servir la documentation Swagger

// Gestion des erreurs
app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Erreur interne du serveur' });
  });
// Route principale
  app.use('/', (req, res) => {
    res.send('Hello World!');
    });
  // Gestion des routes non trouvées (404)
app.use((req, res) => {
    res.status(404).json({ error: 'Route non trouvée' });
  });
const port = process.env.PORT || 8050; // Définition du port sur lequel le serveur sera lancé
// Démarrage du serveur sur le port spécifié
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    }
);