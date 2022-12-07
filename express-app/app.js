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
var estoqueRouter = require('./routes/estoque/EstoqueController');
///////////////
const Investidor = require('./routes/investidor/Investidor');
const Compra = require('./routes/compra/Compra');
const Venda = require('./routes/venda/Venda');
const Morte = require('./routes/estoque/Estoque');


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
app.use('/', estoqueRouter);

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
app.get('/relatorio/:slug', async (req, res) => {
  
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
      Investidor.findAll().then(async (investidores) => {

          //////////////////////Quantidade
    var amountQ = await Venda.findOne({
      attributes: [sequelize.fn("sum", sequelize.col("quantidade"))],
      raw: true
    });
    var quantidade = (Number(amountQ['sum(`quantidade`)']))

      //////////////////////Unitário
      var amountU = await Venda.findOne({
        attributes: [sequelize.fn("avg", sequelize.col("unitario"))],
        raw: true
      });
      var unitarioT = (Number(amountU['avg(`unitario`)']))
      var unitario = (Number(amountU['avg(`unitario`)'])).toLocaleFixed(2);

      /////Valor da Venda
      var amountVT = (Number(quantidade) * Number(unitarioT))
      var amountV = (Number(quantidade) * Number(unitarioT)).toLocaleFixed(2);
      
          //////////////////////Capital Investidor
    var amountT = await Compra.findOne({
      attributes: [sequelize.fn("sum", sequelize.col("total"))],
      raw: true
    });
    var CapitalInvestidoT = (Number(amountT['sum(`total`)']))
    var CapitalInvestido = (Number(amountT['sum(`total`)'])).toLocaleFixed(2);

    ///Investimento sobre a Venda
    var InvVenda = ((Number(CapitalInvestidoT) / Number(amountVT)) * (100)).toLocaleFixed(2);
  
    ///Lucro sobre Investimento
    var LucroN = (Number(amountVT) - Number(CapitalInvestidoT));
    var Lucro = (Number(amountVT) - Number(CapitalInvestidoT)).toLocaleFixed(2);

    ///Lucro sobre investimento Fazenda
    var LucroFN = (Number(LucroN) / 2)
    var LucroF = (Number(LucroN) / 2).toLocaleFixed(2);

    //Percentual Fazenda 
    var percentualF = ((Number(LucroFN) / Number(LucroN)) * (100)).toLocaleFixed(2);

    res.render("admin/relatorios/index",{
      vendas: investidor.vendas,
      compra: investidor.compras,
      investidores: investidores,
      quantidade, unitario, amountV, CapitalInvestido, InvVenda, Lucro,
      LucroF, percentualF,
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

//Estoque
app.get('/estoque/:slug', async (req, res) => {
  var slug = req.params.slug;
  Investidor.findOne({
    where:{
      slug:slug,
    },
    include: [{
      model: Venda
    },
    {
      model: Compra,
    }]
  }).then( async (investidor) => {
    await  Morte.findOne({
      attributes: [sequelize.fn("sum", sequelize.col("quantidade"))],
      raw: true
    }).then( async (amountQ) => {
    let morte = (Number(amountQ['sum(`quantidade`)']))
    await Compra.findOne({
      attributes: [sequelize.fn("sum", sequelize.col("quantidade"))],
      raw: true
    }).then( async (amountQc) => {
    let comprados = (Number(amountQc['sum(`quantidade`)']))
    await Venda.findOne({
      attributes: [sequelize.fn("sum", sequelize.col("quantidade"))],
      raw: true
    }).then((amountQv) => {
    let vendidos = (Number(amountQv['sum(`quantidade`)']))

    var estoque = ((comprados) - (morte) - (vendidos));

    if (investidor != undefined) {
      Investidor.findAll().then((investidores) => {
    res.render("admin/estoque/index",{
      vendas: investidor.vendas,
      compras: investidor.compras,
      investidores: investidores,
      morte,comprados,vendidos,estoque,
    })
  })
} else {
  res.redirect("admin/estoque/index");
}
  })
})
    })
  })
  .catch((err) => {
    res.redirect("admin/estoque/index");
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