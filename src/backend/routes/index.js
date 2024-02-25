const express = require("express");
const router = express.Router();

// GET: home page
router.get("/", async (req, res) => {
	try {
		res.render("pages/home");
	} catch (error) {
		console.error(error);
		res.render("pages/error", {status: 500})
	}
});
router.get("/browse", async (req, res) => {
	try {
		res.render("pages/browse");
	} catch (error) {
		console.error(error);
		res.render("pages/error", {status: 500});
	}
});
router.get("/car", async (req, res) => {
	try {
		res.render("pages/car");
	} catch (error) {
		console.error(error);
		res.render("pages/error", {status: 500});
	}
});
router.get("/about-us", async (req, res) => {
	try {
		res.render("pages/about-us");
	} catch (error) {
		console.error(error);
		res.render("pages/error", {status: 500});
	}
});
router.get("/favorites", async (req, res) => {
	try {
		res.render("pages/favorites");
	} catch (error) {
		console.error(error);
		res.render("pages/error", {status: 500});
	}
});
router.get("/page", async (req, res) => {
	try {
		res.render("pages/page");
	} catch (error) {
		console.error(error);
		res.render("pages/error", {status: 500});
	}
});

module.exports = router;

/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/
