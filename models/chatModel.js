const { DataTypes } = require("sequelize");
const sequelize = require("../util/db");
const user = require("./userModel");

const Chat = sequelize.define('chat', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: user,
            key: 'id'
        },
        allowNull: false,
    },
}, {
    timestamps: true,
});

Chat.belongsTo(user, { foreignKey: 'userId' });

module.exports = Chat