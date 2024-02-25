const express = require("express");
const router = express.Router();
const { startOfDay, subDays } = require('date-fns');
const Visitor = require("../models/visitor");
const mark = require("../models/mark");
const packet = require("../models/packet");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const confirmation = require("../models/confirmation");
const rating = require("../models/rating");
const car = require("../models/car");
const page = require("../models/page");
const { isValidObjectId } = require("mongoose");
const { ObjectId } = require("mongodb");
const preTranslated = require("../utils/preTranslated");
const translate = require("../utils/translate");
const { v4: uuidv4 } = require('uuid');

const transporter = nodemailer.createTransport({
	host: "smtp.porkbun.com",
    port: 465,
	secure: true,
	auth: {
		user: process.env.NODEMAILER_EMAIL,
		pass: process.env.NODEMAILER_PASSWORD,
	},
});
router.get("/api/visitors", async (req, res) => {
	try {
		const currentDate = new Date();
		const last30Days = subDays(startOfDay(currentDate), 30);
		const last366Days = subDays(startOfDay(currentDate), 366);

		// Get visitors for the last 30 days (no duplicate fingerprints)
		const visitorsOfMonth = await Visitor.aggregate([
			{ $match: { timestamp: { $gte: last30Days, $lte: currentDate } } },
			{
				$group: {
					_id: { $dateToString: { format: "%d.%m", date: "$timestamp" } },
					fingerprints: { $addToSet: "$fingerprint" },
				},
			},
		]);

		// Get visitors for the last 366 days grouped by month (no duplicate fingerprints)
		const visitorsOfYear = await Visitor.aggregate([
		  {
		    $match: { timestamp: { $gte: last366Days, $lte: currentDate } },
		  },
		  {
		    $group: {
		      _id: { $dateToString: { format: "%m.%Y", date: "$timestamp" } },
		      fingerprints: { $addToSet: "$fingerprint" },
		    },
		  },
		]);


		const monthData = {};
		visitorsOfMonth.forEach((visitor) => {
			monthData[visitor._id] = visitor.fingerprints.length;
		});

		const yearData = {};
		visitorsOfYear.forEach((visitor) => {
			yearData[visitor._id] = visitor.fingerprints.length;
		});

		res.json({ month: monthData, year: yearData });
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});
const rateMsgs = {
	"confirm-text": {
		en: "Thank you for your rating. Please use the following code to confirm your email address:",
		de: "Danke für deine Bewertung. Bitte benutze den folgenden Code, um deine E-Mail zu bestätigen:",
		cs: "Ďakujeme za vašu ocenu. Prosím použijte následující kód:",
	},
	"confirm-text-two": {
		en: "If you didn't sign up for this service, you can safely ignore this email.",
		de: "Wenn Sie sich nicht für diesen Dienst angemeldet haben, können Sie diese E-Mail ignorieren.",
		cs: "Ak ste sa do tejto služby nezaregistrovali, môžete tento e-mail pokojne ignorovať."
	},
	"confirm-title": {
		en: "Email Confirmation",
		de: "E-Mail Bestätigung",
		cs: "E-mail potvrdenie",
	},
	"email-send-success": {
		en: "Email send successfully",
		de: "E-Mail gesendet",
		cs: "E-mail odoslaný",
	},
	"commited-rating": {
		en: "Your rating has been successfully committed!",
		de: "Deine Bewertung wurde erfolgreich abgeschickt!",
		cs: "Vaša ocena bola úspešne kommitovaná!",
	},
	"confirm-hello": {
		en: "Hello",
		de: "Hallo",
		cs: "Vitaj",
	},
	"footer-text": {
		en: "Best regards",
		de: "Mit freundlichen Grüßen",
		cs: "S Pozdravom",
	}
}
router.post("/api/rating/commit/:target", async (req, res) => {
	try {
		const { name, email, stars, comment, code, language } = req.body;
		const target = req.params.target;
		const ratingCar =
			target === "about-us" ? true : await car.findOne({ _id: new ObjectId(target) });
		const verifiedEmail = await confirmation.findOne({
			$and: [{ email: email, code: code }],
		});
		const targetRating = await rating.findOne({
			$and: [{ email: email, target: target }],
		});
		const englishComment = await translate(comment, "en", true);
		if (!ratingCar) return res.status(404).send("Car not found");
		if (!verifiedEmail)
			return res.status(404).send("Email or code is not valid");
		const createdTime = Date.now() - verifiedEmail.createdAt;
		const exceedTime = 1000 * 60 * 5;
		//delete email confirmation
		await confirmation.deleteOne({ email });

		if (createdTime > exceedTime)
			return res.status(404).send("Time limit exceeded");
		const translations = await Promise.all([
			translate(englishComment, "de"),
			translate(englishComment, "cs"),
		]);
		if (targetRating) {
			await rating.updateOne(
				{ $and: [{ email: email, target: target }] },
				{
					name: name,
					stars: stars,
					comment: englishComment,
					de: {
						comment: translations[0],
					},
					cs: {
						comment: translations[1],
					}
				}
			);
		} else {
			await rating.insertMany({
				name: name,
				email: email,
				stars: stars,
				comment: englishComment,
				de: {
					comment: translations[0],
				},
				cs: {
					comment: translations[1],
				},
				target: target,
			});
		}
		if (target !== "about-us") {	
			const ratingsData = await rating.find({ target: target });
			const totalRatings = ratingsData.length;
			const totalStars = ratingsData.reduce((acc, curr) => acc + curr.stars, 0);
			const averageRating = (totalStars / totalRatings).toFixed(1);
			
			await car.updateOne(
				{ _id: new ObjectId(target) },
				{
					rating: averageRating,
					ratings: totalRatings,
					stars: totalStars,
				}
			);
		}

		res.send(rateMsgs["commited-rating"][language]);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});
router.post("/api/confirmation/create", async (req, res) => {
	try {
		const { email, name, lang } = req.body;
		const code = crypto.randomBytes(4).toString("hex");
		const html = `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Email Confirmation</title>
				<style>
					body {
						font-family: Arial, sans-serif;
						line-height: 1.6;
						margin: 0;
						padding: 0;
					}
					.container {
						max-width: 600px;
						margin: 0 auto;
						padding: 20px;
					}
					.header {
    					background-color: white;
    					padding: 10px;
    					border: 1px solid #ddd;
    					border-bottom: none;
					}
					.content {
    					padding: 20px;
    					border: 1px solid #ddd;
    					background-color: #f4f6fc;
					}
					.footer {
						background-color: #333333;
					    padding: 10px;
					    color: white;
					}
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h2>${rateMsgs["confirm-title"][lang]}</h2>
					</div>
					<div class="content">
						<p>${rateMsgs["confirm-hello"][lang]} ${name},</p>
						<p>${rateMsgs["confirm-text"][lang]}</p>
						<h3 style="text-align: center; background-color: #a10303; padding: 10px; color: white; border-radius: 5px">${code}</h3>
						<p>${rateMsgs["confirm-text-two"][lang]}</p>
					</div>
					<div class="footer">
						<p>${rateMsgs["footer-text"][lang]},<br>VM-CAR-TEAM</p>
					</div>
				</div>
			</body>
			</html>
		`;
		const mailOptions = {
			from: `VM-CAR-TEAM <${process.env.NODEMAILER_EMAIL}>`,
			to: email,
			subject: rateMsgs["confirm-title"][lang],
			html: html,
		};

		await confirmation.insertMany({ email, code });
		await transporter.sendMail(mailOptions);
		res.send(rateMsgs["email-send-success"][lang]);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

router.post("/api/confirmation/delete/:email", async (req, res) => {
	try {
		const email = req.params.email;
		await confirmation.deleteOne({ email });
		res.send("Email deleted successfully");
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

router.get("/api/ratings/get/:id", async (req, res) => {
	try {
		const perPage = 10;
		const id = req.params.id;
		const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter, default to page 1 if not provided
		const count = await rating.countDocuments({ target: id });
		const maxPages = Math.ceil(count / perPage);
		const skip = (page - 1) * perPage;
		const ratings = await rating
			.find({ target: id })
			.sort({ createdAt: -1 })
			.skip(skip)
			.select("-email -car -__v -_id")
			.limit(perPage)
			.exec();
		res.json({ ratings, maxPages: maxPages });
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

router.get("/api/rating/get/:id", async (req, res) => {
	try {
		const id = req.params.id;
		
		if (!isValidObjectId(id))
			return res.status(400).send("Invalid ID");
		
		const data = await car.findOne({ _id: new ObjectId(id) });
		
		res.json({rating: data.rating, ratings: data.ratings});
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});
router.get("/api/marks", async (req, res) => {
	try {
		const markData = await mark.find().sort({ name: 1 });
		res.json(markData);
	} catch (error) {
		console.error(error);
		res.send("Internal Server Error");
	}
});
router.get("/api/packets", async (req, res) => {
	try {
		const specificPackets = (typeof req.query.specificPackets === "string") ? req.query.specificPackets?.split(",") : req.query.specificPackets;

		const query = [
			{
				$sort: {
					title: 1,
				},
			}];
		
		if(specificPackets){
			query.push({
				$match: {
					_id: {
						$in: specificPackets.map(packet => new ObjectId(packet)),
					},
				},
			});
		}
		const data = await packet.aggregate(query);
		res.json(data);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

router.get("/api/cars", async (req, res) => {
	try {
		const limit = parseInt(req.query.limit) || 30;
		const sortBy = req.query.sortBy || "_id";
		const revertSorting = req.query.revertSorting || false;
		const page = parseInt(req.query.page) || 1;
		const specificCars = (typeof req.query.specificCars === "string"
							  ? req.query.specificCars?.split(",")
							  : req.query.specificCars
							)?.filter(Boolean)?.map(car => new ObjectId(car));
		
		const searchQuery = req.query.search;
		const markQuery = req.query.marks || "";
		const modelQuery = req.query.models || "";
		const packetQuery = req.query.packets || "";
		const colorQuery = req.query.colors || "";
		const distanceQuery = req.query.distance || "";
		const fuelQuery = req.query.fuel || "";
		const transmissionQuery = req.query.transmission || "";
		const ratingQuery = req.query.rating || "";
		const powerQuery = req.query.power || "";
		const doorQuery = req.query.doors || "";
		const seatQuery = req.query.seats || "";
		const yearQuery = req.query.years || "";
		const language = req.query.lang || "en";
		let pages = 1;

		const query = [];
		if (searchQuery) {
			query.push({
				$search: {
					index: "search",
					text: {
						query: preTranslated.get(language, searchQuery),
        			path: {
        			  wildcard: "*"
        			},
						fuzzy: { maxEdits: 1, prefixLength: 2 },
					},
				},
			});
		}
		const queries = [
			{ key: "mark", query: markQuery },
			{ key: "model", query: modelQuery },
			{ key: "packets", query: packetQuery },
			{ key: "color", query: colorQuery },
			{ key: "distance", query: distanceQuery },
			{ key: "year", query: yearQuery },
			{ key: "fuel", query: fuelQuery },
			{ key: "transmission", query: transmissionQuery },
			{ key: "rating", query: ratingQuery },
			{ key: "power", query: powerQuery },
			{ key: "doors", query: doorQuery },
			{ key: "seats", query: seatQuery },
		];

		for (const { key, query: queryString } of queries) {
			if (queryString !== "") {
				const matchStage = { $match: {} };
				if (
					["rating", "power", "distance", "doors", "seats"].includes(
						key
					)
				) {
					const numericValue = parseFloat(
						queryString
							.toLowerCase()
							.replace("km", "")
							.replace(".", "")
							.replace("kw", "")
					);
					if (!isNaN(numericValue)) {
						if (["doors", "seats"].includes(key))
							matchStage.$match[key] = numericValue;
						else if (key === "distance")
							matchStage.$match[key] = { $lte: numericValue };
						else matchStage.$match[key] = { $gte: numericValue };
					}
				} else if (key === "year") {
					const years = queryString
						.split(",")
						.map((year) => parseInt(year));
					matchStage.$match[key] = { $in: years };
				} else if(queryString.includes(",")) {
					const queryArray = queryString
						.split(",")
						.map((value) => value.trim());
					const regex = queryArray.map(
						(value) => new RegExp(value, "i")
					);
					matchStage.$match[key] = { $in: regex };
				} else {
					matchStage.$match[key] = queryString;
				}
				query.push(matchStage);
			}
		}
		query.push(...[
			{
				$sort: { [sortBy]: revertSorting ? -1 : 1},
			},
			{
				$addFields: {
					image: { $arrayElemAt: ["$images", 0] },
				},
			},
			{
				$project: {
					rating: 1,
					ratings: 1,
					keywords: 1,
					title: 1,
					description: 1,
					image: 1,
					de: 1,
					cs: 1,
					rentedUntil: 1,
				},
			},
		]);
		if(specificCars) {
			query.push({
				$match: {
					_id: {
						$in: specificCars,
					},
				},
			});
		}

		const totalCarsArray = await car.aggregate([...query, { $count: "total" }]);
		const totalCars = totalCarsArray[0]?.total || 0;

		if (limit && totalCars > 0) {
			query.push(
			{
				$skip: limit * (page - 1)
			},
			{
				$limit: limit
			});
			pages = Math.ceil(totalCars / limit);
		}

		const data = await car.aggregate(query);
		if (page > pages)
			return res.json({ cars: [], pages: 0 });
		if (data.length === 0)
			return res.json({ cars: [], pages: 1 });
		res.json({ cars: data, pages: pages });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});
router.get("/api/ratings", async (req, res) => {
	try {
		const limit = parseInt(req.query.limit);
		const sortBy = req.query.sortBy;
		const revertSorting = req.query.revertSorting || false;
		const target = req.query.target;
		const hasSortByKey = Object.keys(rating.schema.obj).includes(sortBy);

		if (!target)
			return res.status(400).send("Target is not valid");
		if (!hasSortByKey)
			return res.status(400).send("SortBy key is not valid");
		if (isNaN(limit))
			return res.status(400).send("Limit must be a number");
		
		const query = [
			{
				$match: {
					target: target,
				}
			},
			{
				$sort: {
					[sortBy]: (revertSorting ? -1 : 1),
					createdAt: -1
				},
			},
			{
				$project: {
					name: 1,
					stars: 1,
					comment: 1,
					de: 1,
					en: 1,
					cs: 1,
				}
			}
		];
		if (limit)
			query.push({ $limit: limit });
		
		const data = await rating.aggregate(query);
		if(!data)
			return res.status(404).send("No data found");
		
		res.json(data);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});
router.get("/api/car", async (req, res) => {
	try {
		const id = req.query.id;

		if (!isValidObjectId(id))
			return res.status(400).send("ID is not valid");
		
		const data = await car.findOne({ _id: id });

		if (!data)
			return res.status(404).send("No data found");
		res.json(data);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error")
	}
});
const multer = require('multer');
const path = require('path');
const fs = require("fs");
const baseDirectory = path.join(__dirname, "../../../resources/assets/");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uuid = req.query.uuid;
    const uploadPath = path.join('resources/assets/uploads/', uuid || uuidv4());
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post('/api/images', (req, res) => {
	try {
    const uuid = req.query.uuid || uuidv4(); // Generate or use the provided UUID
    req.query.uuid = uuid; // Update the UUID in the query object
    upload.array('images')(req, res, (err) => {
    if (err) {
    	return res.status(400).json({ error: 'Error uploading image' });
	}
		const directories = req.files[0]?.destination?.split(/[\\/]/); // Split with linux & Windows seperator
      	res.json({ files: req.files, uuid: directories[directories?.length - 1] });
    });
  } catch (error) {
    console.error(error);
  }
});
router.delete("/api/image/", (req, res) => { 
	try {
		const imgPath = req.query.path;
		const fullPath = path.join(baseDirectory, imgPath);
		if (fs.existsSync(fullPath)) {
			fs.unlinkSync(fullPath);
			res.status(200).send("Deleted");
		}
		else
			res.status(404).send("No data found");
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error")
	}
})
router.get("/api/page",  async (req, res) => {
	try {
		const slug = req.query.slug;
		const data = await page.findOne({ slug: slug });
		if (!data)
			return res.status(404).send("No data found");
		res.json(data);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error")
	}
});
module.exports = router;

/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/
