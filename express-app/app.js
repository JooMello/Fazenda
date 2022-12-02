const express = require("express"),
    path = require("path"),
    logger = require("morgan"),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    routes = require("./routes"),
    app = express();


const sequelize = require("sequelize");
const slugify = require("slugify");
const connection = require("./database/database")
const dolar = require('./api_dolar')
const cep = require('./api-cep')

var investidorRouter = require('./routes/investidor/InvestidorController');
var compraRouter = require('./routes/compra/CompraController');
var projecaoRouter = require('./routes/projecao/ProjecaoController');
var vendaRouter = require('./routes/venda/VendaController');
var relatorioRouter = require('./routes/relatorio/RelatorioController');
///////////////
const Investidor = require('./routes/investidor/Investidor');
const Compra = require('./routes/compra/Compra');
const Venda = require('./routes/venda/Venda');



//view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);
app.use('/', investidorRouter);
app.use('/', compraRouter);
app.use('/', projecaoRouter);
app.use('/', vendaRouter);
app.use('/', relatorioRouter);

connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com sucesso!");
  })
  .catch((error) => {
    console.log(error);
  });

  //Investidor
app.get('/investidor/:slug', (req, res) => {
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
    res.render("admin/compra/filter",{
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

//Compra
app.get('/compra/:slug', (req, res) => {
  var slug = req.params.slug;
  Compra.findOne({
    include: [{
      model: Investidor,
    }],
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

///Projeção
app.get('/projecao/:slug', (req, res) => {
  var slug = req.params.slug;
  Compra.findOne({
    include: [{
      model: Investidor,
    }],
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
  res.redirect("admin/projecao/index");
}
  })
  .catch((err) => {
    res.redirect("admin/projecao/index");
  });
})

//Venda
app.get('/venda/:slug', (req, res) => {
  var slug = req.params.slug;
  Investidor.findOne({
    where:{
      slug:slug,
    },
    include: [{
      model: Venda
    }]
  }).then((investidor) => {
    if (investidor != undefined) {
      Investidor.findAll().then((investidores) => {
    res.render("admin/venda/filter",{
      vendas: investidor.vendas,
      investidores: investidores,
    })
  })
} else {
  res.redirect("admin/venda/index");
}
  })
  .catch((err) => {
    res.redirect("admin/venda/index");
  });
})

//Relatório
app.get('/relatorio/:slug', (req, res) => {
  var slug = req.params.slug;
  Investidor.findOne({
    where:{
      slug:slug,
    },
    include: [{
      model: Venda
    },{
      model: Compra
    }],
  }).then((investidor) => {
    if (investidor != undefined) {
      Investidor.findAll().then((investidores) => {
    res.render("admin/relatorios/index",{
      vendas: investidor.vendas,
      compra: investidor.compras,
      investidores: investidores,
    })
  })
} else {
  res.redirect("admin/relatorios/index");
}
  })
  .catch((err) => {
    res.redirect("admin/relatorios/index");
  });
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.title = "error";
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;