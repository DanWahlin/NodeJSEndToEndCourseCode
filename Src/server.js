'use strict';

//3rd Party Modules

var express                 = require('express'),
    exphbs                  = require('express-handlebars'),
    hbsHelpers              = require('handlebars-helpers'),
    hbsLayouts              = require('handlebars-layouts'),
    passport                = require('passport'),
    flash 	                = require('connect-flash'),
    compression             = require('compression'),
    morgan                  = require('morgan'),
    bodyParser              = require('body-parser'),
    cookieParser            = require('cookie-parser'),
    session                 = require('cookie-session'),
    csurf                   = require('csurf'),
    favicon                 = require('serve-favicon'),
    merge                   = require('merge'),
    //fs                      = require('fs'),

//Local Modules

    customExpressHbsHelpers = require('./lib/hbsHelpers/expressHbsHelpers'),
    db                      = require('./lib/database'),
    brainTreeEngine         = require('./lib/brainTreeEngine'),
    auth                    = require('./lib/auth'),
    cartRepository          = require('./lib/cartRepository'),
    productTypeRepository   = require('./lib/productTypeRepository'),
    routes                  = require('./routes/router.js'),
    port                    = process.env.PORT || 8080,
    app                     = express(),
    config                  = null;
    
if (app.settings.env === 'development') {
  config = require('./config/config.dev.json');
} else {
  config = require('./config/config.json');
}

//*************************************************
//        Handlebars template registration
//*************************************************

var customHelpers = merge(customExpressHbsHelpers, hbsHelpers());

var hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'master',
    helpers: customHelpers
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

//Add custom handlebars template helper functionality
hbsLayouts.register(hbs.handlebars, {});

//*************************************************
//           Middleware and other settings
//*************************************************
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(express.static(__dirname + '/public'));
//app.use(compression()); //Compression done via nginx

//Logging
//var  accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
//app.use(morgan('dev', {stream: accessLogStream}));
app.use(morgan('dev'));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    keys: ['code*with*dan','code*with*dan2014','code*with*dan*keys']
}));
app.use(csurf());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//************************************
// Custom middleware injection
//************************************
//Handle updating response with user authentication model properties for every request/response
app.use(auth.injectAuth);

//Initialize passport authentication for login/logout
auth.init(passport);

//Handle shopping cart total being passed with every response
app.use(cartRepository.injectCart);

//Handle product types being passed with every response
app.use(productTypeRepository.injectProductTypes);

//Pass database config settings
db.init(config.databaseConfig);

//Init the braintree payment API
brainTreeEngine.init(config.brainTreeConfig);

//Handle each request and ensure proper locals are set that are needed by app
app.use(function(req, res, next) {
    res.locals._csrf = req.csrfToken();
    if (req.query.searchtext) {
        res.locals.searchtext = req.query.searchtext;
    }
    res.locals.encodedUrl = encodeURIComponent(req.protocol + '://' + req.get('host') + req.originalUrl);

    next();
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500, { message: err.message });
});

process.on('uncaughtException', function(err) {
    if (err) console.log(err, err.stack);
});


//*********************************************************
//        Ensure DB gets closed when SIGINT called
//*********************************************************

if (process.platform === "win32") {
    require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    }).on("SIGINT", function () {
        console.log('SIGINT: Closing MongoDB connection');
        db.close();
    });
}

process.on('SIGINT', function() {
    console.log('SIGINT: Closing MongoDB connection');
    db.close();
});



//*********************************************************
//    Convention based route loading (saves a lot of code)
//*********************************************************
routes.load(app, './controllers');


/*app.get('*', function(req, res){
 res.render('index.html');
 });*/

app.listen(port, function (err) {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
});





//*********************************************************
//    Quick and dirty way to detect event loop blocking
//*********************************************************
var lastLoop = Date.now();

function monitorEventLoop() {
    var time = Date.now();
    if (time - lastLoop > 1000) console.error('Event loop blocked ' + (time - lastLoop));
    lastLoop = time;
    setTimeout(monitorEventLoop, 200);
}

if (app.settings.env === 'development') {
    monitorEventLoop();
}




