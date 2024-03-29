// const dbConfig = require("./../config/db.config.js"); // Importation de la configuration de la base de données
const {Sequelize}  = require("sequelize"); // Importation de Sequelize, un ORM pour gérer la base de données SQL

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres',
    dialectModule: require('pg'),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
        connectTimeout: 60000,
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
});
const db = {}; // Création d'un objet vide pour stocker les modèles de la base de données

db.Sequelize = Sequelize; // Ajout de Sequelize à l'objet db
db.sequelize = sequelize; // Ajout de l'instance de Sequelize à l'objet db

db.projet = require('./projet.model.js')(sequelize, Sequelize);
db.user = require('./user.model.js')(sequelize, Sequelize); 
db.categorie = require('./categorie.model.js')(sequelize, Sequelize);
db.stack = require('./stack.model.js')(sequelize, Sequelize);

// db.projet.belongsToMany(db.categorie, { through: 'ProjetCategorie', foreignKey: 'projetId', otherKey: 'categorieId' });
// db.categorie.belongsToMany(db.projet, { through: 'ProjetCategorie', foreignKey: 'categorieId', otherKey: 'projetId' });
module.exports = db; // Exportation de l'objet db pour être utilisé dans d'autres modules