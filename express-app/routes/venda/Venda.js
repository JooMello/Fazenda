
const Sequelize = require("sequelize");
const connection = require("../../database/database");
const Investidor = require("../investidor/Investidor")

const Venda = connection.define('vendas', {
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

// UM Investidor tem muitas vendas
// UMA Venda pertence a uma Investidor

Investidor.hasMany(Venda);
Venda.belongsTo(Investidor);

Venda.sync({ force: true });

module.exports = Venda;