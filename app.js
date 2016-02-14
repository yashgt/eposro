var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var datafun = require('./datafun');

var app = express();
//categories
var categories = datafun.getCategories(0,function(categories){
    console.log(categories);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.get('/api/categories', function(req, res) {
    //console.log("On server fetching categories");
	//TODO bring from DB
    res.json(categories);
});

//TODO remove this
app.get('/api/subCategories',function(req, res){
    //console.log("Inside app.get for finding sub cats of "+req.params.parent);
    datafun.getCategories(req.query.parent,function(subCat){
        //console.log(subcat);
        res.json(subCat);
    });
});

app.get('/api/products', function(req,res){
    var cat = req.query.cat;
    var page = req.query.page;
    var products = [];
    for( var j= 0; j<5; j++){
        var pdt = {
            id : req.params.cat + j
            , name: 'Product' + j
            ,cat_id: req.params.cat
        };
        products.push(pdt);
    }
    
    console.log("Returning products of cat :"+cat);
    res.json(products); 
});


app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

});
http.createServer(app).listen(3000, function(){
  console.log('Express server listening on port ' + 3000);
});




