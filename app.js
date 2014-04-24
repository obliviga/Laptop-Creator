var express = require('express'),
	mongoose = require('mongoose')
, http = require('http');

var app = express();

app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + "/public"));
});

mongoose.connect("mongodb://localhost/helloExpress");

var UserSchema = new mongoose.Schema({
	name: String,
	email: String,
	age: Number
}),

	Users = mongoose.model('Users', UserSchema);
// INDEX	
app.get("/users", function (req, res) {
	Users.find({}, function (err, docs) {
		res.render('users/index', { users: docs });
	});
});

//NEW
app.get('/users/new', function (req, res) {
	res.render("users/new");
});

//CREATE
app.post('/users', function (req, res) {
	var b = req.body;
	new Users({
		name: b.name,
		email: b.email,
		age: b.age
	}).save(function (err, user) {
		if (err) res.json(err);
		res.redirect('/users/' + user.name);
	});
});

app.param('name', function (req, res, next, name) {
	Users.find({ name: name }, function (err, docs) {
		req.user = docs[0];
		next();
	});
});

// SHOW
app.get('/users/:name', function (req, res) {
	res.render("users/show", { user: req.user });
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});














