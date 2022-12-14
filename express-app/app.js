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
const Saque = require('./routes/investidor/Saque');


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


  //Compra
app.get('/compra/:id', (req, res) => {
  var id = req.params.id;
      Compra.findAll({
        include: [{
          model: Investidor,
        }],
        where:{
          investidoreId:id,
        },
         raw: true,
        nest: true,
      }).then((compras) => {
      Investidor.findAll().then((investidores) => {
    res.render("admin/compra/index",{
      investidores: investidores,
      compras:compras,
    })

})
})
  .catch((err) => {
    res.redirect("admin/compra/index");
  });
})

//Venda
app.get('/venda/:id', (req, res) => {
    var id = req.params.id;
        Venda.findAll({
          include: [{
            model: Investidor,
          }],
          where:{
            investidoreId:id,
          },
           raw: true,
          nest: true,
        }).then((vendas) => {
        Investidor.findAll().then((investidores) => {
      res.render("admin/venda/index",{
        investidores: investidores,
        vendas:vendas,
      })
  })
  })
    .catch((err) => {
      res.redirect("admin/venda/index");
    });
  })

//Relatório id
app.get('/relatorio/:id', async (req, res) => {
  
  var id = req.params.id;
  Investidor.findOne({
    where:{
      id:id,
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
      where:{
        investidoreId:id,
      },
      raw: true
    });
    var quantidade = (Number(amountQ['sum(`quantidade`)']))

      //////////////////////Unitário
      var amountU = await Venda.findOne({
        attributes: [sequelize.fn("avg", sequelize.col("unitario"))],
        where:{
          investidoreId:id,
        },
        raw: true
      });
      var unitarioT = (Number(amountU['avg(`unitario`)']))
      var unitario = (Number(amountU['avg(`unitario`)'])).toLocaleFixed(2);

      /////Valor da Venda
    var amountVv = await Venda.findOne({
      attributes: [sequelize.fn("sum", sequelize.col("total"))],
      where:{
        investidoreId:id,
      },
      raw: true
    });
    var amountVT = (Number(amountVv['sum(`total`)']))
    var amountV = (Number(amountVv['sum(`total`)'])).toLocaleFixed(2);
      
          //////////////////////Capital Investidor
    var amountT = await Compra.findOne({
      attributes: [sequelize.fn("sum", sequelize.col("total"))],
       where:{
      investidoreId:id,
    },
      raw: true
    });
    var CapitalInvestidoT = (Number(amountT['sum(`total`)']) * Number(1000) )
    var CapitalInvestido = (Number(amountT['sum(`total`)']) * Number(1000)).toLocaleFixed(2);

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

//Relatório data
app.get('/relatorio/:data', async (req, res) => {
  
  var id = req.params.id;
  var data = req.params.data;
  Investidor.findOne({
    where:{
      id:id,
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
      where:{
        data: data,
      },
      raw: true
    });
    var quantidade = (Number(amountQ['sum(`quantidade`)']))

      //////////////////////Unitário
      var amountU = await Venda.findOne({
        attributes: [sequelize.fn("avg", sequelize.col("unitario"))],
        where:{
          data: data,
        },
        raw: true
      });
      var unitarioT = (Number(amountU['avg(`unitario`)']))
      var unitario = (Number(amountU['avg(`unitario`)'])).toLocaleFixed(2);

      /////Valor da Venda
    var amountVv = await Venda.findOne({
      attributes: [sequelize.fn("sum", sequelize.col("total"))],
      where:{
        data: data,
      },
      raw: true
    });
    var amountVT = (Number(amountVv['sum(`total`)']))
    var amountV = (Number(amountVv['sum(`total`)'])).toLocaleFixed(2);
      
          //////////////////////Capital Investidor
    var amountT = await Compra.findOne({
      attributes: [sequelize.fn("sum", sequelize.col("total"))],
       where:{
        data: data,
    },
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
app.get('/estoque/:id', async (req, res) => {
  var id = req.params.id;

    await  Morte.findOne({
      attributes: [sequelize.fn("sum", sequelize.col("quantidade"))],
      where:{
        investidoreId:id,
      },
      raw: true
    }).then( async (amountQ) => {
    let morte = (Number(amountQ['sum(`quantidade`)']))
    await Compra.findOne({
      attributes: [sequelize.fn("sum", sequelize.col("quantidade"))],
      where:{
        investidoreId:id,
      },
      raw: true
    }).then( async (amountQc) => {
    let comprados = (Number(amountQc['sum(`quantidade`)']))
    await Venda.findOne({
      attributes: [sequelize.fn("sum", sequelize.col("quantidade"))],
      where:{
        investidoreId:id,
      },
      raw: true
    }).then((amountQv) => {
    let vendidos = (Number(amountQv['sum(`quantidade`)']))

    var estoque = ((comprados) - (morte) - (vendidos));

      Investidor.findAll().then((investidores) => {
    res.render("admin/estoque/index",{
      investidores: investidores,
      morte,comprados,vendidos,estoque,
    })
  })
})
    })
  })
  .catch((err) => {
    res.redirect("admin/estoque/index");
  });
})

//Morte
app.get('/morte/:id', async (req, res) => {
  var id = req.params.id;

  //////////////////////mortes
  var amountQ = await Morte.findOne({
    attributes: [sequelize.fn("sum", sequelize.col("quantidade"))],
    where:{
      investidoreId:id,
    },
    raw: true
  });
  var qmorte = (Number(amountQ['sum(`quantidade`)']))

  Morte.findAll({
    include: [{
        model: Investidor,
      }],
      where:{
        investidoreId:id,
      },
  }).then((mortes) => {
      Investidor.findAll().then((investidores) => {
    res.render("admin/estoque/morte",{
      mortes: mortes,
      investidores: investidores,
      qmorte,
    })
  })
})
  .catch((err) => {
    res.redirect("admin/estoque/morte");
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