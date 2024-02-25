/// <reference path="../../../../typings/globals/jquery/index.d.ts" />

const currentPage = parseInt(new URL(location.href).searchParams.get("page")) || 1;
const $pages = $("#pages");
const $paginationInput = $("#pagination input");
const $paginationPrevious = $("#pagination #previous");
const $paginationGo = $("#pagination #go");
const $paginationNext = $("#pagination #next");
const $filterBtn = $("#filter-button");
const $filterMoreOptionsBtn = $("#more-options-button");
const $filterResetBtn = $("#reset-button");
import { pages, url, loadCars, loadSearchValue, searchInput, removeLoading, $search } from "./utils/general";
import { filter } from "./filters/index";
import { language, lang } from "./languages/language";
import {browseLang} from "./languages/browse";
import "../css/browse.css";
import "../css/responsive.css";

$(document).ready(async () => {
    lang = browseLang;
    await loadCars({ limit: 30, revertSorting: true});
    const pageParam = url.searchParams.get("page");
    let page = parseInt(pageParam);
    const searchValue = url.searchParams.get("search");
    if (isNaN(page) || page < 1 || page > pages) {
        page = currentPage;
        url.searchParams.set("page", page);
        window.history.replaceState({}, "", url.href);
    }

    $("#go").click((e) => {
        e.preventDefault();

        const newPage = parseInt($("#page-input").val());
        if (!isNaN(newPage) && newPage >= 1 && newPage <= pages) {
            url.searchParams.set("page", newPage);
            window.location.href = url.href;
        }
    });
    if (!searchValue) {
        url.searchParams.delete("search");
        window.history.replaceState({}, "", url.href);
    }
    $filterMoreOptionsBtn.click(() => {
        filter.toggle();
    });
    $filterResetBtn.click(() => {
        filter.reset();
    });
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
    $("#filter-button").text("UPDATE");
    $("#sub-actions").showFlex();
    $("#filter-button").css("margin-top", "30px")
    url.searchParams.set("page", currentPage - 1);
    $("#previous").attr("href", url.href);
    url.searchParams.set("page", currentPage + 1);
    $("#next").attr("href", url.href);
    $("#search-input").val(searchValue);

    /* Pagination */
    $pages.text(`${page} / ${pages}`);
    $paginationInput.val(page);
    $paginationInput.attr("max", pages);
    $paginationGo.show();
    $paginationInput.show();
    loadSearchValue = searchInput.val();
    if (page > 1)
        $paginationPrevious.show();
    if (page < pages)
        $paginationNext.show();
    await filter.init();
    language.init();
    removeLoading();
});
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/