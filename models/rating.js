module.exports = function (sequelize, DataTypes) {
    var Rating = sequelize.define("Rating", {
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        body: {
            type: DataTypes.STRING(300),
            allowNull: false
        }
    }, { freezeTableName: true });

    Rating.associate = function (models) {
        Rating.belongsTo(models.Restaurant, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Rating;
};
