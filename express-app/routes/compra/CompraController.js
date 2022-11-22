const express = require('express');
const router = express.Router();
const Compra = require("./Compra");
const slugify = require("slugify");
const sequelize = require("sequelize");
const { Op } = require("sequelize");

var app = express();

const Investidor = require("../investidor/Investidor")



router.get('/admin/compra', (req, res, next) => {

  Compra.findAll({
    order: [
      ["createdAt", "DESC"]
    ],
     raw: true,
    nest: true,
  }).then((compras) => {
    Investidor.findAll().then((investidores) => {
      res.render('admin/compra/index', {
        compras,
        investidores,
      });
    })
  })
});

router.get('/admin/compra/new', (req, res) => {
  Investidor.findAll().then((investidores) => {
    res.render('admin/compra/new', {
      investidores,
    });
  });
});

router.post('/compra/save', (req, res) => {
  
  var data = req.body.data;
  var quantidade = req.body.quantidade;
  var valor_unitario = req.body.valor_unitario;
  var valor_compra = req.body.valor_compra;
  var dolar = req.body.dolar;
  var compra_dolar = req.body.compra_dolar;
  var investidores = req.body.investidores;

  Compra.bulkCreate([{
    data: data,
    quantidade: quantidade,
    valor_unitario: valor_unitario,
    valor_compra: valor_compra,
    dolar: dolar,
    compra_dolar: compra_dolar,
    investidoreId: investidores,
  }], {
    ignoreDuplicates: true,
  } )
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
  var valor_unitario = req.body.valor_unitario;
  var valor_compra = req.body.valor_compra;
  var dolar = req.body.dolar;
  var compra_dolar = req.body.compra_dolar;
  var investidor = req.body.investidor;

  Compra.update({
    data: data,
    quantidade: quantidade,
    valor_unitario: valor_unitario,
    valor_compra: valor_compra,
    dolar: dolar,
    compra_dolar: compra_dolar,
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

app.get('/compra/:slug', (req, res) => {
  var slug = req.params.slug;
  Compra.findOne({
    where:{
      slug:slug,
    },
  }).then((compra) => {
      Investidor.findAll().then((investidores) => {
    res.render("compra",{
      compra,
      investidores,
    })
  })
  })
})

module.exports = router;
