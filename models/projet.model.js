module.exports = (sequelize, DataTypes) => {
    const Projet = sequelize.define("projet", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        categorie: {
            type: DataTypes.JSON,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        image: {
            type: DataTypes.JSON,
            allowNull: true
        },
        fonctionnalite: {
            type: DataTypes.JSON,
            allowNull: true
        },
        stack: {
            type: DataTypes.JSON,
            allowNull: true
        },
        githubRepository: {
            type: DataTypes.STRING,
            allowNull: true
        },
        website: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: true
    });
    return Projet;
}