const express = require('express');
const router = express.Router();
const slugify = require("slugify");
const sequelize = require("sequelize");
const { Op } = require("sequelize");

const Investidor = require("../investidor/Investidor");
const Compra = require('../compra/Compra');
const Venda = require('../venda/Venda');


router.get('/admin/estoque', async (req, res, next) => {
    Compra.findAll({
        include: [{
            model: Investidor,
          }],
    }).then((compras) => {
  Venda.findAll({
    include: [{
        model: Investidor,
      }],
  }).then((vendas) => {
    Investidor.findAll().then((investidores) => {
      res.render('admin/estoque/index', {
        compras: compras,
        vendas: vendas,
        investidores: investidores,
      });
    })
  })
})
});


module.exports = router;
