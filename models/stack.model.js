module.exports = (sequelize, DataTypes) => {
    const Stack = sequelize.define("stack", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        timestamps: true
    });
    return Stack;
};