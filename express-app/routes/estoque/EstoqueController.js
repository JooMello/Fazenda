const express = require('express');
const router = express.Router();
const slugify = require("slugify");
const sequelize = require("sequelize");
const { Op } = require("sequelize");

const Investidor = require("../investidor/Investidor");
const Compra = require('../compra/Compra');
const Venda = require('../venda/Venda');
const Morte = require('../estoque/Estoque');

router.get('/admin/estoque', async (req, res, next) => {

    //////////////////////mortes
    var amountQ = await Morte.findOne({
      attributes: [sequelize.fn("sum", sequelize.col("quantidade"))],
      raw: true
    });
    var morte = (Number(amountQ['sum(`quantidade`)']))

//////////////////////comprados
    var amountQc = await Compra.findOne({
      attributes: [sequelize.fn("sum", sequelize.col("quantidade"))],
      raw: true
    });
    var comprados = (Number(amountQc['sum(`quantidade`)']))
    
//////////////////////vendidos
var amountQv = await Venda.findOne({
  attributes: [sequelize.fn("sum", sequelize.col("quantidade"))],
  raw: true
});
var vendidos = (Number(amountQv['sum(`quantidade`)']))

//////////////////////estoque
var estoque = ((comprados) - (morte) - (vendidos));

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
    Morte.findAll({
      include: [{
          model: Investidor,
        }],
    }).then((mortes) => {
    Investidor.findAll().then((investidores) => {
      res.render('admin/estoque/index', {
        compras: compras,
        vendas: vendas,
        mortes: mortes,
        investidores: investidores,
        morte,comprados,vendidos,estoque,
      });
    })
  })
  })
})
});

router.get('/admin/estoque/newMorte', (req, res) => {
    Investidor.findAll().then((investidores) => {
      res.render('admin/estoque/newMorte', {
        investidores: investidores,
      });
    });
  });

router.post('/morte/save',  (req, res) => {
    var data = req.body.data;
    var quantidade = req.body.quantidade;
    var investidor = req.body.investidor;
  
     Morte.create(
     {
      data: data,
      quantidade: quantidade,
      investidoreId: investidor
    })
    .then(() => {
      res.redirect("/admin/estoque");
    });
  });

module.exports = router;
