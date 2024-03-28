module.exports = (sequelize, DataTypes) => {
    // Création d'un modèle Sequelize "Todo". Ce modèle représente une table "todo" dans la base de données.
    // Chaque instance de ce modèle représente une ligne dans la table.
    // allowNull indique si le champ peut etre null ou pas. (equivalent a required)
    const Todo = sequelize.define("todo", {
        // La colonne "title" est de type STRING et ne peut pas être nulle. Elle représente le titre de la tâche.
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // La colonne "description" est de type STRING. Elle représente une description détaillée de la tâche.
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // La colonne "image" est de type JSON. Elle représente les images associées à la tâche.
        images: {
            type: DataTypes.JSON,
            allowNull: true
        },
        // La colonne "status" est de type BOOLEAN avec une valeur par défaut de false. Elle représente l'état de la tâche, terminée ou non.
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        // L'option "timestamps" est définie sur false, donc Sequelize n'ajoutera pas les colonnes createdAt et updatedAt à la table.
        // modifier la condition apres avoir creer une base de donnée entraine une erreur lors du fetch car uil n'a pas créé les colonne createdAt et updateAt. 
        timestamps: true
    });
    // Le modèle "Todo" est retourné pour être utilisé dans d'autres parties de l'application.
    return Todo;
};