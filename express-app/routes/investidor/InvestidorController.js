const express = require('express');
const router = express.Router();
const Investidor = require("./Investidor");
const slugify = require("slugify");
const sequelize = require("sequelize");
const {
  Op
} = require("sequelize");

const Compra = require("../compra/Compra");

var app = express();

router.get('/admin/investidor', (req, res, next) => {

  Investidor.findAll({
    order: [
      ["createdAt", "DESC"]
    ],
     raw: true,
    nest: true,
  }).then((investidores) => {
    res.render('admin/investidor/index', {
      investidores,
    });
  })
});



router.get('/admin/investidor/new', (req, res, next) => {
  Investidor.findAll().then((investidores) => {
    res.render('admin/investidor/new', {
      investidores,
    });
  })
})

router.post('/investidor/save', (req, res, next) => {
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

  Investidor.create({
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
    res.redirect("/admin/investidor");
  });
});

router.get("/admin/investidor/edit/:id", (req, res) => {
  var id = req.params.id;

Investidor.findByPk(id)
.then((investidor) => {
  if (investidor != undefined) {
    res.render('admin/investidor/edit', {
      investidor,
    })
  } else{
    res.redirect('/');
  }
})
.catch((err) => {
  res.redirect('/');
})
})

router.post('/investidor/update', (req, res) => {
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

  Investidor.update({
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
    res.redirect("/admin/investidor");
  })
  .catch((err) => {
    res.send("erro:" + err);
  });
})

router.post('/investidor/delete', (req, res) => {
  var id = req.body.id;
  if (id != undefined) {
    if (!isNaN(id)) {
      Investidor.destroy({
        where: {
          id: id,
        },
      }).then(() => {
        res.redirect("/admin/investidor");
      });
    } else {
      // NÃO FOR UM NÚMERO
      res.redirect("/admin/investidor");
    }
  } else {
    // NULL
    res.redirect("/admin/investidor");
  }
});



module.exports = router;
