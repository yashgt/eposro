var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var epdb = require('./epdb');

var app = express();

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

	//TODO bring from DBepdb
	epdb.getCategories(0,function(catsResponse){
		var categories=catsResponse;
		res.json(categories);
	});	
});

//TODO remove this
app.get('/api/subCategories',function(req, res){
    
    epdb.getCategories(req.query.parent,function(subCat){
        
        res.json(subCat);
    });
});

app.get('/api/products', function(req,res){
    var cat = req.query.catID;
    var page = req.query.lastPage;
    var products = [];
    for( var j= 1; j<6; j++){
        var pdt = {
            id : j.toString()
            , name: 'Product' + j
            ,catID: cat
        };
        products.push(pdt);
    }
    
    
    res.json(products); 
});

//adding and removing cart from th eDB
app.post('/api/addToCart', function(req,res){
   
	var pdtID = parseInt(req.body.pdtID);
    var userID = req.body.userID;
    var city = req.body.city;
    
    //set session variable with city
    //req.session.city = city;//somehwhat like this?
    
	epdb.addToCart(userID,pdtID,city,function(str){
		
		res.send(str);
	});
	
	//res.send("Hello");
});
app.post('/api/removeFromCart', function(req,res){
    
	var pdtID = parseInt(req.body.pdtID);
    var userID = req.body.userID;
    var city = req.body.city;

    epdb.removeFromCart(userID, pdtID, function(str){
		
		res.send(str);
    });
});

app.post('/api/cart',function(req,res){
	var userID = req.body.userID;
	epdb.fetchCart(userID, function(cart){
		console.log("Sending res = "+cart);	
		res.send(cart);
	});
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

http.createServer(app).listen(3000, function(){
  console.log('Express server listening on port ' + 3000);
});




