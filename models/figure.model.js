module.exports = (sequelize, DataTypes) => {
    const Figure = sequelize.define("figure", {
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.JSON,
            allowNull: true
        },
        video: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        timestamps: true,
        validate: {
            //eitherImageOrVideo est une fonction de validation personnalisée qui vérifie si au moins l'une des propriétés imageUrl ou videoUrl est présente. Si aucune d'entre elles n'est présente, elle lance une erreur.
            eitherImageOrVideo() {
                if (!this.image && !this.video) {
                    throw new Error('Au moins une image ou une vidéo est requise');
                }
            }
        }
    });
    return Figure;
}