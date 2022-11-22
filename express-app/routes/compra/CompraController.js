const express = require('express');
const router = express.Router();
const Compra = require("./Compra");
const slugify = require("slugify");
const sequelize = require("sequelize");
const { Op } = require("sequelize");

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

router.post('/compra/save', (req, res, next) => {
  var name = req.body.name;
  var phone = req.body.phone;
  var email = req.body.email;
  var cpf = req.body.cpf;
  var cep = req.body.cep;
  var logradouro = req.body.logradouro;
  var uf = req.body.uf;
  var cidade = req.body.cidade;
  var number = req.body.number;
  var obs = req.body.obs;

  Compra.create({
    name: name,
    slug: slugify(name),
    phone: phone,
    email: email,
    cpf: cpf,
    cep: cep,
    logradouro: logradouro,
    uf: uf,
    cidade: cidade,
    number: number,
    obs: obs,
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
  var id = req.body.id;
  var name = req.body.name;
  var phone = req.body.phone;
  var email = req.body.email;
  var cpf = req.body.cpf;
  var cep = req.body.cep;
  var logradouro = req.body.logradouro;
  var uf = req.body.uf;
  var cidade = req.body.cidade;
  var number = req.body.number;
  var obs = req.body.obs;

  Compra.update({
    name: name,
    slug: slugify(name),
    phone: phone,
    email: email,
    cpf: cpf,
    cep: cep,
    logradouro: logradouro,
    uf: uf,
    cidade: cidade,
    number: number,
    obs: obs,
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
