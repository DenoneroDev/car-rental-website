/// <reference path="../../../../typings/globals/jquery/index.d.ts" />
import { loadCars, removeLoading } from "./utils/general";
import { language, lang } from "./languages/language";
import { favoritesLang } from "./languages/favorites";
import "../css/favorites.css";
import "../css/responsive.css";
$(document).ready(async () => {
    lang = favoritesLang;
    try {
        await loadCars({ specificCars: localStorage.getItem("savedCars") });
    } catch (error) {
        console.log("Failed to acess localStorage");
    }
    language.init();
    removeLoading();
});