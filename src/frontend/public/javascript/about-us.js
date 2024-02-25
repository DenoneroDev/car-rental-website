import { ratings } from "./utils/rating";
import { language, lang } from "./languages/language";
import { removeLoading } from "./utils/general";
import { aboutUsLang } from "./languages/about-us";
import "../css/about-us.css";
import "../css/responsive.css";

$(document).ready(() => {
    lang = aboutUsLang;
    ratings.init();
	language.init();
	removeLoading();
})