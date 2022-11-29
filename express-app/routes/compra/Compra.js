
const Sequelize = require("sequelize");
const connection = require("../../database/database");
const Investidor = require("../investidor/Investidor")

const Compra = connection.define('compras', {
    data: {
        type: Sequelize.DATE,
        allowNull: false
    },
    quantidade: {
        type: Sequelize.STRING,
        allowNull: false
    },
    unitario: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    dolar: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
});

// UM Investidor tem muitas compras
// UMA Compra pertence a uma Investidor

Investidor.hasMany(Compra);
Compra.belongsTo(Investidor);

//Compra.sync({ force: true });

module.exports = Compra;