var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var formidable = require('formidable');
var http = require('http');
var socket = require('socket.io');

var { createClient } = require('redis')
var redisClient = createClient({legacyMode: true})
redisClient.connect().catch((err)=>console.error(err))



var app = express();
var http = http.Server(app);
var io = socket(http);

io.on('connection', function(socket){
  
  console.log('Novousuário conectado!');
  
});

var indexRouter = require('./routes/index')(io);
var adminRouter = require('./routes/admin')(io);

app.use(function(req, res, next){

  if(req.method !== 'POST') return next();

  console.log('REQ URL', req.url)

  if(['/admin/menus','/admin/reservations', '/admin/users','/admin/users/password-change', '/subscribe'].indexOf(req.url) === -1) return next();

  var form = new formidable.IncomingForm({
    uploadDir: path.join(__dirname, '/public/images'),
    keepExtensions: true
  });

  form.parse(req, function(err, fields, files){

//    req.body = fields;
    req.fields = fields;
    req.files = files;

    next();
  
  });

})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  store: new RedisStore({client: redisClient}),
  secret: 'p@s5w0rd',
  resave: true,
  saveUninitialized: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

http.listen(3000, function(){
  console.log('servidor em execução...');
});

//module.exports = app;
