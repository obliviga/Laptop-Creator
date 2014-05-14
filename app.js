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
// Index	
app.get("/laptops", function (req, res) {
	Laptops.find({}, function (err, docs) {
		res.render('laptops/index', { laptops: docs });
	});
});

// New Laptop Page
app.get('/laptops/newLaptop', function (req, res) {
	res.render("laptops/newLaptop");
});

// Creating a new laptop
app.post('/laptops', function (req, res) {
	var x = req.body;
	new Laptops({
		screenSize: x.screenSize,
		hardDrive: x.hardDrive,
		ram: x.ram,
		price: x.price
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

// Display the selected laptop via ID
app.get('/laptops/:_id', function (req, res) {
	res.render("laptops/show", { laptop: req.laptop });
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});














