const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../resources", ".env") });
const connect = require("./config/database");
const IP = require('ip');
const app = express();
const Fingerprint = require('express-fingerprint');
const ejs = require("ejs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const Visitor = require("./models/visitor");
const OS = require("os");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const compression = require("compression");
const cors = require('cors');

ejs.delimiter = "/";
ejs.openDelimiter = "[";
ejs.closeDelimiter = "]";
// mongodb configuration
connect();
// view setup
app.set("views", path.join(__dirname, "../frontend", "views"));
app.set("view engine", "ejs");


// Save the session secret to the DB
app.use(compression({
	level: 6,
}));
app.use(session({
	secret: process.env.ADMIN_COOKIE_PASSWORD,
  	resave: false,
  	saveUninitialized: true,
	rolling: false,
	store: new MongoStore({
        mongooseConnection: mongoose.connection,
    }),
}));

// manage route
const manage = require("./routes/manage");
app.use("/manage", manage);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../frontend", "public")));
app.use(express.static(path.join(__dirname, "../../resources/assets")));
app.use(
	Fingerprint({
		parameters: [
			Fingerprint.useragent,
			Fingerprint.acceptHeaders,
		],
	})
);
app.use(cookieParser());

app.use(cors({
	origin: "*",
}));

app.get('/selective', (req, res) => {
    res.json({ message: 'CORS-enabled for selected origins only!' });
});
// global variables across routes
app.use(async (req, res, next) => {
	try {
		const isFetch = req.headers['x-requested-with'] === 'XMLHttpRequest';
		
		if (!isFetch) {
			const cookies = req.cookies;
			let language = cookies.language || (req.acceptsLanguages()[0] || "en").split("-")[0];
			language = ["de", "cs"].includes(language) ? language : "en";

			if (!cookies.language)
			    res.cookie("language", language);
			res.locals.language = language;

			const fingerprintCookie = cookies.fingerprint;
			const visitor = fingerprintCookie ? await Visitor.findOne({ fingerprint: fingerprintCookie }) : null;
			
			if (!visitor && fingerprintCookie) {
				const fingerprint = req.fingerprint.hash;
				const newVisitor = new Visitor({ fingerprint: fingerprint });
				await newVisitor.save();
				res.cookie("fingerprint", fingerprint);
			}

			const pages = await page.find({});
			res.locals.links = pages.map(page => {
				return { title: page.title, slug: page.slug, footer: page.footer, navigation: page.navigation };
			});

			res.locals.numbers = {
				de: process.env.DE_NUMBER,
				cs: process.env.CS_NUMBER
			};
		}
		next();
	} catch (error) {
		console.error(error);
		res.status(500).render("pages/error", { status: 500, number: "500500500500", links: [] });
	}
});

//routes config
const index = require("./routes/index");
const api = require("./routes/api");
const page = require("./models/page");

app.use("/", index);
app.use("/", api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	try {
		res.render("pages/error", {status: 404});
	} catch (error) {
		console.error(error);
		res.render("pages/error", { status: 500 });
	}
});

// error handler
app.use(function (err, req, res, next) {
	res.locals.message = err.message;
	res.locals.status = err.status;
	res.render("error");
});

const port = OS.platform() === "win32" ? 4000 : process.env.PORT;
const ip = IP.address();
const QR = require('qrcode-terminal');
console.log(OS.platform())
app.listen(port, [ip, "localhost"], () => {
	QR.generate(`http://${ip}:${port}/`, {small: true});
	console.log(`http://${ip}:${port}/`);
});


module.exports = app;
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/