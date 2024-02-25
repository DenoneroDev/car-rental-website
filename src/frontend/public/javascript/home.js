/// <reference path="../../../../typings/globals/jquery/index.d.ts" />

const $rating = $("#website-ratings");
const $filterBtn = $("#filter-button");
let swiper;
let ratings;
import { loadCars, url, $search, loadSearchValue } from "./utils/general";
import { Rating } from "./elements/rating";
import { filter } from "./filters/index";
import { language, lang } from "./languages/language";
import { removeLoading } from "./utils/general";
import { homeLang } from "./languages/home";
import "../css/home.css";
import "../css/responsive.css";


$(document).ready(async () => {
    lang = homeLang;
    url.pathname = "/browse";
    configureSwiper();
    await loadCars({ limit: 4, revertSorting: true, sortBy: "rating" });
    ratings = await $.ajax({
        url: "/api/ratings",
        type: "GET",
        data: { limit: 5, revertSorting: true, sortBy: "stars", target: "about-us" },
        error: () => {
            console.log("Internal Server Error");
        }
    });
    for (const rating of ratings) {
        const ratingCard = new Rating(rating);
        $rating.append(ratingCard.render());
    }
    $filterBtn.click((event) => {
	    event.preventDefault();
	    url.searchParams.set("page", 1);
	    const searchValue = $("#search-input").val();
	    if (searchValue != "")
	    	url.searchParams.set("search", searchValue);
	    else url.searchParams.delete("search");
	    filter.submit();
    });
    $search.submit((event) => {
		event.preventDefault();
		url.searchParams.set("page", 1);
		const searchValue = $("#search-input").val();
		if (searchValue !== loadSearchValue)
			filter.reset();
		if (searchValue != "")
			url.searchParams.set("search", searchValue);
		else url.searchParams.delete("search");
		filter.submit();
	})

    await filter.init();
    language.init();
    removeLoading();
});
function configureSwiper() {
    swiper = new Swiper(".swiper", {
    	spaceBetween: 100,
		autoplay: {
			delay: 15000,
		},
    });
    swiper.slideReset();
}
export function reConfigureSwiper() {
    const oldIndex = swiper.activeIndex;
    const oldSpeed = swiper.params.speed;
    swiper.removeAllSlides();
    for (const rating of ratings) {
        const ratingCard = new Rating(rating);
        swiper.appendSlide(ratingCard.render());
    }
    swiper.params.speed = 0;
    swiper.slideTo(oldIndex);
    swiper.params.speed = oldSpeed;
    swiper.autoplay.start();
}