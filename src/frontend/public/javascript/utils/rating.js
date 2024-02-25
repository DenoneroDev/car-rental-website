/// <reference path="../../../../../typings/globals/jquery/index.d.ts" />
const $ratingBtn = $("#ratingBtn");
const $stars = $("#stars img");
const $email = $("#email");
const $name = $("#name");
const $comment = $("#comment");
const $code = $("#code");
const $footer = $("footer");
const $ratingsContainer = $("#ratings");
const $rating = $("#top-stars #car-rating");
const $ratings = $("#top-stars #car-ratings");
let checkTimout;
let errorTimeout;
let currentPage = 1;
let maxPages = 1;
let target;
const data = {
	email: "",
	name: "",
	comment: "",
	stars: 3,
};
import { language } from "../languages/language";
import { aboutUsLang } from "../languages/about-us";
import {car, carID} from "../utils/general";
export const ratings = {
	init: () => {
		target = (window.location.pathname === "/about-us") ? "about-us" : carID;
		loadListeners();
		loadCarRating();
	}
}

function loadListeners() {
	$(window).scroll(handleScroll);
	$stars.click(function () {
		data.stars = parseInt($(this).data("index")) + 1;

		$stars.removeClass("selected");
		for (let i = 0; i <= $(this).data("index"); i++)
			$($stars[i]).addClass("selected");
	});

	$email.on("input", function () {
		data.email = $email.val();

		$email.css("color", "black");
		clearTimeout(checkTimout);

		checkTimout = setTimeout(() => {
			if (check(data.email)) $(this).css("color", "green");
			else $(this).css("color", "red");
		}, 1000);
	});
	$ratingBtn.click(function () {
		data.name = $name.val();
		data.comment = $comment.val();

		$ratingBtn.html(aboutUsLang["rate-loading"][language.lang]);

		if (!data.name) {
			errorInput($name, aboutUsLang["error-invalid-name"][language.lang]);
			return;
		} else if (data.name > 50) {
			errorInput($name, aboutUsLang["error-name-too-long"][language.lang]);
			return;
		}
		if (!check(data.email)) {
			errorInput($email, aboutUsLang["error-invalid-email"][language.lang]);
			return;
		} else if (data.email.length > 100) {
			errorInput($email, aboutUsLang["error-email-too-long"][language.lang]);
			return;
		}
		if (!data.comment) {
			errorInput($comment, aboutUsLang["error-invalid-comment"][language.lang]);
			return;
		} else if (data.comment.length > 500) {
			errorInput($comment, aboutUsLang["error-comment-too-long"][language.lang]);
			return;
		}
		$.ajax({
			url: "/api/confirmation/create",
			type: "POST",
			data: {
				name: data.name,
				email: data.email,
				lang: language.lang,
			},
			success: function (msg) {
				$ratingBtn.html(aboutUsLang["rate-btn"][language.lang]);
				Swal.fire({
					title: aboutUsLang["email-send-success-title"][language.lang],
					input: "text",
					inputAttributes: {
						autocapitalize: "off",
					},
					showCancelButton: true,
					confirmButtonText: aboutUsLang["email-send-success-btn"][language.lang],
					showLoaderOnConfirm: true,
					allowOutsideClick: () => !Swal.isLoading(),
				}).then((result) => {
					if (!result.isConfirmed) {
						$.ajax({
							url: `/api/confirmation/delete/${data.email}`,
							type: "POST",
							data: { ...data, code: result.value },
						});
						return;
					}
					$ratingBtn.html(aboutUsLang["rate-loading"][language.lang]);
					$.ajax({
						url: `/api/rating/commit/${target}`,
						type: "POST",
						data: {
							...data,
							code: result.value,
							lang: language.lang,
						},
						success: function (msg) {
							Swal.fire(
								aboutUsLang["rating-post-success"][language.lang],
								msg,
								"success"
							);
							reset();
							reloadRatings();
						},
						error: function (msg) {
							$ratingBtn.html(aboutUsLang["rate-btn"][language.lang]);
							Swal.fire({
								icon: "error",
								title: "Oops...",
								text: msg.responseText,
							});
							$.ajax({
								url: `/api/confirmation/delete/${data.email}`,
								type: "POST",
								data: {
									...data,
									code: result.value,
								},
							});
						},
					});
				});
			},
			error: function (msg) {
				$ratingBtn.html(aboutUsLang["rate-btn"][language.lang]);
				Swal.fire({
					icon: "error",
					title: "Oops...",
					text: msg.responseText,
				});
			},
		});
	});
}
function loadRatings(page) {
	$(window).off("scroll", handleScroll);
	if (page <= maxPages && target !== "about-us") {
		$.ajax({
			url: `/api/ratings/get/${carID}?page=${page}`,
			method: "GET",
			success: function (data) {
				maxPages = data.maxPages;
				data.ratings.forEach((rating) => {
					const element = $("<div>");
					element.addClass("rating");
					const stars = () => {
						const imgs = [];
						for (let i = 0; i < rating.stars; i++) {
							imgs.push(
								`<img src="/images/star.png" class="selected"/>`
							);
						}
						for (let i = 5 - imgs.length; i > 0; i--)
							imgs.push(`<img src="/images/star.png"/>`);
						return imgs.toString().replaceAll(",", "");
					};
					const inner = `
							<div>
								<div class="top">
									<p class="name">${rating.name}</p>
									<p>|</p>
									<div class="stars">
										${stars()}
									</div>
								</div>
								<p class="time">
									${convertTime(Date.now() - Date.parse(rating.createdAt))}
								</p>
							</div>
							<p class="comment">
								${(language.lang == "en") ? rating.comment : rating[language.lang].comment}
							</p>`;
					element.html(inner);
					$ratingsContainer.append(element);
				});
				$(window).scroll(handleScroll);
			},
			error: function (error) {
				console.error("Error occurred while loading ratings:", error);
			},
		});
	}
}
function loadCarRating() {
	if (typeof car != "undefined") {
		$rating.text(car.rating);
		$ratings.text(`(${car.ratings})`);
	}
}
function reloadCarRating() {
	if (typeof carID !== undefined) {
		$.ajax({
			url: `/api/rating/get/${carID}`,
			method: "GET",
			success: function (data) {
				$rating.text(data.rating);
				$ratings.text(`(${data.ratings})`);
			},
		})
	}
}
export function reloadRatings() {
	$ratingsContainer.html("");
	currentPage = 1;
	loadRatings(0);
	reloadCarRating();
}
function handleScroll() {
	if (isScrollAtBottom()) {
		currentPage++;
		loadRatings(currentPage);
	}
}
function isScrollAtBottom() {
	const windowHeight = $(window).height();
	const documentHeight = $(document).height() - ($footer.outerHeight() + 800);
	const scrollTop = $(window).scrollTop();
	const scrollBottom = Math.round(scrollTop + windowHeight);
	return scrollBottom >= documentHeight;
}
function check(email) {
	return (
		email.match(
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		) && email.length <= 100
	);
}
function errorInput($input, msg, shouldClearTimeout = true) {
	if (shouldClearTimeout) clearTimeout(errorTimeout);
	$ratingBtn.html(msg);
	$input.css("border", "2px solid red");
	$input.css("color", "red");

	errorTimeout = setTimeout(() => {
		$ratingBtn.html(aboutUsLang["rate-btn"][language.lang]);
		$input.css("border", "none");
		$input.css("color", "black");
	}, 3000);
}
function reset() {
	$ratingBtn.html(aboutUsLang["rate-btn"][language.lang]);
	$code.val("");
	$($stars[4]).removeClass("selected");
	$($stars[3]).removeClass("selected");
	$email.val("");
	$name.val("");
	$comment.val("");
}
function convertTime(milliseconds) {
	const timeUnits = [
		{ unit: "year", ms: 365.25 * 24 * 60 * 60 * 1000 },
		{ unit: "day", ms: 24 * 60 * 60 * 1000 },
		{ unit: "hour", ms: 60 * 60 * 1000 },
		{ unit: "minute", ms: 60 * 1000 },
		{ unit: "second", ms: 1000 },
	];

	for (const { unit, ms } of timeUnits) {
		if (milliseconds >= ms) {
			const count = Math.floor(milliseconds / ms);
			return count === 1 ? `1 ${unit} ago` : `${count} ${unit}s ago`;
		}
	}

	return "Just now";
}
