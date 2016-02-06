var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
//app.use('/users', users);
app.get('/api/categories', function(req, res) {
	res.json([
        {
            id:"101"
            ,title:"Dairy"
            ,sub_cat:["Cow Milk","Buffalo Milk","Flavoured Milk","Sweets","Icecream","Butter","Cheese"]
        }
        ,{
            id:"102"
            ,title:"Bakery"
            ,sub_cat:["Toasts","Biscuits","Cakes","Bread"]
        }
        ,{
            id:"103"
            ,title:"Beverages"
            ,sub_cat:["Cold-drinks","Juices","Alcohol","Hot beverages"]
        }
        ,{
            id:"104"
            ,title:"Hygiene"
            ,sub_cat:["Soaps","Hand sanitizers","Mouth wash","Diapers","Washing powders","Shaving products"]
        }
        ,{
            id:"105"
            ,title:"Grains"
            ,sub_cat:["Rice","Wheat","Oats","Barley","Corn","Rye"]
        }
        ,{
            id:"106"
            ,title:"Baby Care"
            ,sub_cat:["Diapers","Powder","Baby Soap"]
        }
        ,{
            id:"107"
            ,title:"Eggs"
            ,sub_cat:[]
        }
        ,{
            id:"108"
            ,title:"Grocery"
            ,sub_cat:[]
        }
    ]);
});

//req.params.
//TODO define URL for /api/products.
//Based on the parameter, provide new data
// catch 404 and forward to error handler
app.get('/api/products/:cat', function(req, res){
    var pdts = [];
    
    for(var i=0; i<=4; i++){
        var pdt = {
            id : "*" + i
            , name: 'Product' + i
            ,cat_id: req.params.cat
        };
        pdts.push(pdt);
    }
    //console.log("Called the first match");
    res.json(pdts);
});
app.get('/api/products/:cat/:page', function(req, res){
    
    page = parseInt(req.params.page);
    
	var pdts = [];
	for(var i=0; i<=6; i++){
		var pdt = {
			id : page.toString() + i
			, name : 'Product' + i   
            , cat_id: req.params.cat
		};
		pdts.push(pdt);
	}
	res.json(pdts);
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
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




