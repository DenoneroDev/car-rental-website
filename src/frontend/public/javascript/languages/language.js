export let lang;
import { getKeyByValue, capitalize } from "../utils/general";
const $number = $("#menue .contact");
export const language = {
    lang: null,
    dropdown: null,
    section: null,
    init: () => {
        language.section = document.getElementById("language");
        language.dropdown = new Choices(language.section, {
            removeItemButton: true,
            duplicateItemsAllowed: false,
            editItems: true,
            searchEnabled: false,
            searchChoices: false,
            allowHTML: true,
        });
        const languages = {
            english: "en",
            deutsch: "de",
            čeština: "cs"
        };
        language.lang = $("html").attr("lang");
        language.dropdown._findAndSelectChoiceByValue(capitalize(getKeyByValue(languages, language.lang)));
        language.section.addEventListener("change", (event) => {
            Cookies.set("language", languages[event.target.value.toLowerCase()]);
            $("html").attr("lang", languages[event.target.value.toLowerCase()]);
            language.update();
        });
        language.update();
    },
    update: () => {
        language.lang = $("html").attr("lang");
        lang.special();
        $("[data-langKey]").each((index, element) => {
            const translatedText = lang[$(element).data().langkey][language.lang];
            if ($(element).get(0).nodeName === "INPUT" || $(element).get(0).nodeName === "TEXTAREA") {
                return $(element).attr("placeholder", translatedText);
            }
            $(element).html(translatedText);
        });

    }
}