const express = require('express');
const router = express.Router();
const Compra = require("./Compra");
const slugify = require("slugify");
const sequelize = require("sequelize");
const { Op } = require("sequelize");

var app = express();

const Investidor = require("../investidor/Investidor")


router.get('/admin/compra', async (req, res, next) => {
  Compra.findAll({
    include: [{
      model: Investidor,
    }],
    order: [
      ["createdAt", "DESC"]
    ],
     raw: true,
    nest: true,
  }).then((compras) => {
      res.render('admin/compra/index', {
        compras,
      });
  })
});

router.get('/admin/compra/new', (req, res) => {
  Investidor.findAll().then((investidores) => {
    res.render('admin/compra/new', {
      investidores: investidores,
    });
  });
});

router.post('/compra/save',  (req, res) => {
  var data = req.body.data;
  var quantidade = req.body.quantidade;
  var unitario = req.body.unitario;
  var total = req.body.total;
  var dolar = req.body.dolar;
  var amount = req.body.amount;
  var investidor = req.body.investidor;

   Compra.create(
   {
    data: data,
    quantidade: quantidade,
    unitario: unitario,
    total: total,
    dolar: dolar,
    amount: amount,
    investidoreId: investidor
  })
  .then(() => {
    res.redirect("/admin/compra");
  });
});

router.get("/admin/compra/edit/:id", (req, res) => {
  var id = req.params.id;

Compra.findByPk(id)
.then((compra) => {
  if (compra != undefined) {
    res.render('admin/compra/edit', {
      compra,
    })
  } else{
    res.redirect('/');
  }
})
.catch((err) => {
  res.redirect('/');
})
})

router.post('/compra/update', (req, res) => {
  var data = req.body.data;
  var quantidade = req.body.quantidade;
  var unitario = req.body.unitario;
  var total = req.body.total;
  var dolar = req.body.dolar;
  var amount = req.body.amount;
  var investidor = req.body.investidor;

  Compra.update({
    data: data,
    quantidade: quantidade,
    unitario: unitario,
    total: total,
    dolar: dolar,
    amount: amount,
    investidoreId: investidor,
  }, {
    where: {
      id: id,
    }
  })
  .then(() => {
    res.redirect("/admin/compra");
  })
  .catch((err) => {
    res.send("erro:" + err);
  });
})

router.post('/compra/delete', (req, res) => {
  var id = req.body.id;
  if (id != undefined) {
    if (!isNaN(id)) {
      Compra.destroy({
        where: {
          id: id,
        },
      }).then(() => {
        res.redirect("/admin/compra");
      });
    } else {
      // NÃO FOR UM NÚMERO
      res.redirect("/admin/compra");
    }
  } else {
    // NULL
    res.redirect("/admin/compra");
  }
});



module.exports = router;
