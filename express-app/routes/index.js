var express = require('express');
var router = express.Router();

const Investidor = require("./investidor/Investidor")
const Compra = require("./compra/Compra");


/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', );
});

app.get('/:slug', (req, res) => {
  var slug = req.params.slug;
  Compra.findOne({
    where:{
      slug:slug,
    },
  }).then((compra) => {
    if (compra != undefined) {
      Investidor.findAll().then((investidores) => {
    res.render("compra",{
      compra: compra,
      investidores: investidores,
    })
  })
} else {
  res.redirect("admin/compra/index");
}
  })
  .catch((err) => {
    res.redirect("admin/compra/index");
  });
})


app.get('/:slug', (req, res) => {
  var slug = req.params.slug;
  Investidor.findOne({
    where:{
      slug:slug,
    },
    include: [{
      model: Compra
    }]
  }).then((investidor) => {
    if (investidor != undefined) {
      Investidor.findAll().then((investidores) => {
    res.render("admin/investidor/index",{
      compras: investidor.compras,
      investidores: investidores,
    })
  })
} else {
  res.redirect("admin/compra/index");
}
  })
  .catch((err) => {
    res.redirect("admin/compra/index");
  });
})



module.exports = router;
