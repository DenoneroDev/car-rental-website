export const $cars = $("#cars");
export const $search = $("#search");
const menueButton = $("#menue-button");
const menue = $("#menue");
const number = $(".number");
const searchButton = $("#search-icon");
const logo = $(".logo");
const search = $("#search");
const header = $("#header");
export const searchInput = $("#search-input");
const $loading = $("#loading");
const $error = $("#error");
const $msg = $("#msg");
let quill;
let isMenueOpen = false;
let isSearchOpen = false;
let isMenueEnabled = true;
let isSearchEnabled = true;
let numberWasDisplayed = true;
export const url = new URL(window.location);
export let cars = [];
export let loadSearchValue = "";
export let pages;
export let car;
export let carID;

export function loadContact() {
	
}
$(document).ready(function () {
	header.height(header.height());
  	var dotCount = 26;
  	var dotSize = 10;
  	var dotSpace = 15;
  	var dotStart = ((dotCount / 2 + 1) * (dotSize + dotSpace)) / 2;

  	for (var i = 1; i <= dotCount; i++) {
  	  var dotMove = Math.ceil(i / 2);
  	  var dotPos = dotStart - ((dotSize + dotSpace) * dotMove);
  	  var animationDelay = -(i * 0.1) + "s";

  	  if (i % 2 === 0) {
  	    animationDelay = -((i * 0.1) + (2 / 2)) + "s";
  	  }

  	  var dot = $('<div class="dot"></div>')
  	    .css('animation-delay', animationDelay)
  	    .css('left', dotPos + 'px');

  	  var dotBefore = $('<div></div>')
  	    .css('animation-delay', animationDelay);

  	  dot.append(dotBefore);
  	  $('.loader').append(dot);
  	}

	menueButton.click(() => toggleMenue());
	$search.submit((event) => {
		event.preventDefault();
		url.pathname = "/browse";
		url.searchParams.set("page", 1);
		const searchValue = $("#search-input").val();
		if (searchValue != "")
			url.searchParams.set("search", searchValue);
		else url.searchParams.delete("search");

		location.href = url.href;
	})
	$(document)
		.bind("mouseup touchend", (event) => {
			if (
				isMenueOpen &&
				!menue.is(event.target) &&
				menue.has(event.target).length === 0 &&
				menueButton.has(event.target).length == 0 &&
				!menueButton.is(event.target)
			)
				toggleMenue();
			if (
				isSearchOpen &&
				!search.is(event.target) &&
				search.has(event.target).length === 0
			)
				toggleSearch();
		})
		.on("scroll", () => {
			if (isMenueOpen) toggleMenue();
			if (isSearchOpen) toggleSearch();
		});
	if (document.body.clientWidth <= 1000)
		searchButton.click(() => toggleSearch());
});

function toggleSearch() {
	if (isSearchEnabled) {
		isSearchEnabled = false;
		if (isSearchOpen) {
			searchInput.focusout();
			header.css({ "justify-content": "space-around" });
			search.css({ border: "none" });
			searchButton.css({
				position: "absolute",
				top: `${searchButton.position().top}px`,
				left: `${searchButton.position().left}px`,
			});
			searchButton.animate(
				{
					left: "65.4219px",
				},
				250,
				() => {
					searchButton.css({ position: "unset" });
				}
			);
			searchInput.animate(
				{
					width: "0",
				},
				250,
				() => {
					searchInput.hide();
					if (numberWasDisplayed) $(number).showFlex();
					else menueButton.show();
					$(logo[0]).show();
					isSearchOpen = false;
					isSearchEnabled = true;
				}
			);
		} else {
			
			numberWasDisplayed = $(number[0]).is(":visible");
			header.css({ "justify-content": "center" });
			search.css({ border: "1px solid var(--black)" });
			searchInput.width(0);
			searchInput.show();
			$(logo[0]).hide();
			$(number[0]).hide();
			menueButton.hide();
			searchInput.animate(
				{
					width: "100%",
				},
				250,
				() => {
					isSearchOpen = true;
					isSearchEnabled = true;
					searchInput.focus();
				}
			);
		}
	}
}
function toggleMenue() {
	if (isMenueEnabled) {
		isMenueEnabled = false;
		menueButton.toggleClass("open");
		if (isMenueOpen) {
			menue.animate(
				{
					height: 0,
					padding: 0,
				},
				250,
				() => {
					menue.hide();
					isMenueOpen = false;
					isMenueEnabled = true;
				}
			);
		} else {
			menue.showGrid();
			menue.css("height", "auto");
			menue.css("padding", "20px");
			const autoHeight = menue.outerHeight();
			menue.height(0);
			menue.animate(
				{
					height: autoHeight,
				},
				250,
				() => {
					isMenueOpen = true;
					isMenueEnabled = true;
				}
			);
		}
	}
}
Array.prototype.remove = function (item) {
	const index = this.indexOf(item);
	if (index !== -1) {
		this.splice(index, 1);
	}
};
export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
export function getKeyByValue(obj, value) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] === value) {
      return key;
    }
  }
  return null;
}
$.fn.showFlex = function () {
	this.css({ display: "flex" });
};
$.fn.showGrid = function () {
	this.css({ display: "grid" });
};
export async function loadQuill(content = "") {
	quill = new Quill("#quill-editor", {
		theme: "snow",
		readOnly: true,
	});
	quill.root.innerHTML = content;
}
export async function loadCars(data = {}) {
	const carsData = await $.ajax({
		url: `/api/cars${location.search}`,
        type: "GET",
		data: data,
	});
	cars = carsData.cars;
	pages = carsData.pages;
	if (pages === 0) {
		$msg.text(`WHOO!! We don't have the page ${currentPage}! Sorry!`);
		$error.showGrid();
		return;
	}
	if (carsData.cars.length !== 0) {
		$error.hide();
		return;
	}
	for (const car of carsData.cars) {
        const articleCard = new Article(car);
        $cars.append(articleCard.render());
    }
}
export function removeLoading() {
    $loading.fadeOut();
    $("html").css({ overflow: "auto" });
}
export function convertDate(date) {
  const m = moment(date);
 return m.locale($("html").attr("lang")).format("LL")
}

/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/
