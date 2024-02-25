/// <reference path="../../../../typings/globals/jquery/index.d.ts" />

const $topTitle = $("#top #title");
const $id = $("#id");
const $swiperWrapper = $(".swiper-wrapper");
const $contentInner = $("#content-inner");
export const $detailArea = $("#detail-area");
export const $packets = $("#packets");
const $packetArea = $("#packet-area");
export let $detailTable;
let $imageField;
let $viewport;
let maxIndex = -1;
let swiper;
let imageList;
export let carPackets = [];
import { CarDetailsTable } from "./elements/carDetails";
import { CarImage } from "./elements/carImage";
import { Packet } from "./elements/packet";
import { ratings } from "./utils/rating";
import { language, lang } from "./languages/language";
import {car, carID, removeLoading, loadQuill} from "./utils/general";
import {carLang} from "./languages/car";
import "../css/car.css";
import "../css/responsive.css";

$(document).ready(async () => {
	lang = carLang;
    car = await $.ajax({
        url: "/api/car",
		data: { id: new URL(location.href).searchParams.get("id") },
		error: (err) => {
			location.href = "/error/404";
		}
	});
	if (car.packets.length != 0)
		carPackets = await $.ajax({
			url: "/api/packets",
			data: { specificPackets: car.packets },
		});
	else
		$packetArea.remove();
    carID = car._id;
    $topTitle.text(car.title);
    document.title = document.title.replace("Car", car.title);
	$id.text(`UUID: ${car.uuid}`);
	if(car.rentedUntil)
		$detailArea.append(`
			<p id="info" data-langKey="info">
			</p>
		`);
	$detailArea.append(new CarDetailsTable(car).render());
	$detailTable = $("#detail-area table");

    for (const [index, image]  of car.images.entries()) {
        $swiperWrapper.append(new CarImage(image, index).render());
        $imageField = $("#image-area #image");
        $contentInner.append(new CarImage(image, index, true).render());
        $viewport = $("#image-list #viewport");
        maxIndex++;
	}
    for (const packet of carPackets)
		$packets.append(new Packet(packet).render());
    swiper = new Swiper(".swiper", {
        navigation: {
			nextEl: "#nextButton",
			prevEl: "#prevButton",
		},
		pagination: {
			el: ".swiper-pagination",
			type: "progressbar",
		},
    });
    imageList = new ScrollBooster({
		viewport: document.querySelector("#image-list #viewport"),
		content: document.querySelector("#image-list #content"),
		direction: "horizontal",
		scrollMode: "transform",
		bounceForce: 0.35,
		friction: 0.3,
	});
	try {
		if (localStorage.getItem("savedCars")?.includes(carID)) {
			$("#car-content #save").animate({
				backgroundColor: "#a10303",
			});
		}
	} catch (error) {
		console.log("Failed to access the localStorage");
	}
    loadEventListeners();
    selectImage(0);
	imageList.scrollTo({ x: 0 });
	ratings.init();
	language.init();
    loadQuill(language.lang == "en" ? car.description : car[language.lang].description);
	removeLoading();
});

function loadEventListeners() {
    swiper.on("slideChange", function (event) {
		selectImage(event.activeIndex);
    });
    $("#image-list img").bind("mouseup touchend", (image) => {
		if (!imageList.getState().isDragging)
			selectImage($(image.target).data("index"));
	});
	$("#image-container #image").click(() => {
		$("#image-container").toggleFullScreen();
    });
	$("#car-content #save").click(function () {
		try {
			const carIDs = localStorage.getItem("savedCars")?.split(",").filter(Boolean) || [];
			if (!carIDs.includes(carID)) {
				carIDs.push(carID);
				localStorage.setItem("savedCars", `${carIDs.toString()}`);
				$(this).animate({
					backgroundColor: "#a10303",
				});
			} else {
				carIDs.remove(carID);
				if (Array.isArray(carIDs))
					localStorage.setItem("savedCars", `${carIDs.toString()}`);
				else localStorage.removeItem("savedCars");
				$(this).animate({
					backgroundColor: "#ddd",
				});
			}
		} catch (error) {
			console.log("Failed to access the localStorage");
		}
    });
    $(document).bind("fullscreenchange", () => {
	    $("#image-container #image").toggleClass("fullscreen");
    });
}
function selectImage(index) {
	const $image = $('#image-list img[data-index="' + index + '"]');
	const $oldImage = $(
		'#image-list img[data-index="' + $imageField.data("index") + '"]'
    );
	const width = $image.outerWidth();
	const left = $image.position().left;
	const right = left + (width + 15);
	const min = index > 0 ? left - (width + 15) : 0;
	const max = index < maxIndex ? right + width : imageList.content.width;
	const scrollPosLeft = Math.abs(imageList.position.x);
	const scrollPosRight = scrollPosLeft + imageList.viewport.width;
	const isOverLeft = min < scrollPosLeft;
	const isOverRight = max > scrollPosRight;
	const scrollPos = isOverLeft
		? min
		: isOverRight
		? max - imageList.viewport.width
		: scrollPosLeft;

	$oldImage.css("border", "none");
	$image.css("border", "4px solid var(--red)");
	$imageField.data("index", index);
	swiper.slideTo(index);
	imageList.scrollTo({ x: scrollPos });
}