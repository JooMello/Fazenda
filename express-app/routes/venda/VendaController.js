const express = require('express');
const router = express.Router();
const Venda = require("./Venda");
const slugify = require("slugify");
const sequelize = require("sequelize");
const { Op } = require("sequelize");

const Investidor = require("../investidor/Investidor")


router.get('/admin/venda', async (req, res, next) => {
  Venda.findAll({
    include: [{
      model: Investidor,
    }],
    order: [
      ["createdAt", "DESC"]
    ],
     raw: true,
    nest: true,
  }).then((vendas) => {
    Investidor.findAll().then((investidores) => {
      res.render('admin/venda/index', {
        vendas: vendas,
        investidores: investidores,
      });
    })
  })
});

router.get('/admin/venda/new', (req, res) => {
  Investidor.findAll().then((investidores) => {
    res.render('admin/venda/new', {
      investidores: investidores,
    });
  });
});

router.post('/venda/save',  (req, res) => {
  var data = req.body.data;
  var quantidade = req.body.quantidade;
  var unitario = req.body.unitario;
  var total = req.body.total;
  var dolar = req.body.dolar;
  var amount = req.body.amount;
  var investidor = req.body.investidor;

   Venda.create(
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
    res.redirect("/admin/venda");
  });
});

router.get("/admin/venda/edit/:id", (req, res) => {
  var id = req.params.id;

Venda.findByPk(id)
.then((venda) => {
  if (venda != undefined) {

    Investidor.findAll().then((investidores) => {
    res.render('admin/venda/edit', {
      venda: venda,
      investidores: investidores,
    })
  })
  } else{
    res.redirect('/admin/venda');
  }
})
.catch((err) => {
  res.redirect('/admin/venda');
})
})

router.post('/venda/update', (req, res) => {
  var id = req.body.id;
  var data = req.body.data;
  var quantidade = req.body.quantidade;
  var unitario = req.body.unitario;
  var total = req.body.total;
  var dolar = req.body.dolar;
  var amount = req.body.amount;
  var investidor = req.body.investidor;

  Venda.update({
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
    res.redirect("/admin/venda");
  })
  .catch((err) => {
    res.send("erro:" + err);
  });
})

router.post('/venda/delete', (req, res) => {
  var id = req.body.id;
  if (id != undefined) {
    if (!isNaN(id)) {
      Venda.destroy({
        where: {
          id: id,
        },
      }).then(() => {
        res.redirect("/admin/venda");
      });
    } else {
      // NÃO FOR UM NÚMERO
      res.redirect("/admin/venda");
    }
  } else {
    // NULL
    res.redirect("/admin/venda");
  }
});


module.exports = router;
