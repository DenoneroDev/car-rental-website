/// <reference path="../../../../typings/globals/jquery/index.d.ts" />
import { loadQuill, removeLoading } from "./utils/general";
import { language, lang } from "./languages/language";
import { headerLang } from "./languages/header";
import "../css/page.css";
import "../css/responsive.css";

$(document).ready(async () => {
    lang = headerLang;

    headerLang.special = () => {};
    const data = await $.ajax({
        url: "/api/page",
        data: { slug: new URL(location.href).searchParams.get("slug") || "" },
        error: (err) => {
            location.href = "/error/404";
        }
    });
    await loadQuill(data.content);
    document.title = document.title.replace("Page", data.title);
    language.init();
    removeLoading();
});