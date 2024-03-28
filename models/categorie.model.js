module.exports = (sequelize, DataTypes) => {
    const Categorie = sequelize.define("categorie", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        timestamps: true
    });
    return Categorie;
};