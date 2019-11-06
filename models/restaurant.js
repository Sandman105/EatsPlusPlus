module.exports = function (sequelize, DataTypes) {
    var Restaurant = sequelize.define("Restaurant", {
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        category: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        address: {
            type: DataTypes.STRING(150),
            allowNull: false
        }
    }, {freezeTableName: true});

    Restaurant.associate = function(models){
        Restaurant.hasMany(models.Rating, {
            foreignKey: {
                allowNull: false
            }
        });
    }; 
    
    return Restaurant;
};
