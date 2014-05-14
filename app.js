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

mongoose.connect("mongodb://localhost/laptopDB");

var LaptopSchema = new mongoose.Schema({
	screenSize: String,
	hardDrive: String,
	ram: String,
	price: Number
}),

	Laptops = mongoose.model('Laptops', LaptopSchema);
// INDEX	
app.get("/laptops", function (req, res) {
	Laptops.find({}, function (err, docs) {
		res.render('laptops/index', { laptops: docs });
	});
});

//NEW
app.get('/laptops/new', function (req, res) {
	res.render("laptops/new");
});

//CREATE
app.post('/laptops', function (req, res) {
	var b = req.body;
	new Laptops({
		screenSize: b.screenSize,
		hardDrive: b.hardDrive,
		ram: b.ram,
		price: b.price
		// _id: b._id
	}).save(function (err, laptop) {
		if (err) res.json(err);
		res.redirect('/laptops/' + laptop._id);
	});
});

app.param('_id', function (req, res, next, _id) {
	Laptops.find({ _id: _id }, function (err, docs) {
		req.laptop = docs[0];
		next();
	});
});

// SHOW
app.get('/laptops/:_id', function (req, res) {
	res.render("laptops/show", { laptop: req.laptop });
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});














