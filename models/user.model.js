module.exports = (sequelize, DataTypes) => {
    // Création d'un modèle Sequelize
    // Ce modèle représente une table "user" dans la base de données.
    // Chaque instance de ce modèle représente une ligne dans la table.
    // allowNull indique si le champ peut etre null ou pas. (equivalent a required)
    const User = sequelize.define("user", {
        // La colonne "email" est de type STRING et ne peut pas être nulle. Elle représente l'adresse email de l'utilisateur.
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // La colonne "password" est de type STRING et ne peut pas être nulle. Elle représente le mot de passe de l'utilisateur.
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // La colonne "role" est de type STRING et ne peut pas être nulle. Elle représente le rôle de l'utilisateur.
        role: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        // L'option "timestamps" est définie sur false, donc Sequelize n'ajoutera pas les colonnes createdAt et updatedAt à la table.
        // modifier la condition apres avoir creer une base de donnée entraine une erreur lors du fetch car uil n'a pas créé les colonne createdAt et updateAt. 
        timestamps: true
    });
    return User;
};
    // Le modèle "User" est retourné pour être utilisé dans d'autres parties de l'application.
