import { packet } from "./packet";
import { mark } from "./mark";
import { color } from "./color";
import { distance } from "./distance";
import { fuel } from "./fuel";
import { transmission } from "./transmission";
import { rating } from "./rating";
import { power } from "./power";
import { doors } from "./doors";
import { seats } from "./seats";
import { year } from "./year";
import { model } from "./model";
import { url } from "../utils/general";
import { filterLang } from "../languages/filter";
import {language} from "../languages/language";

export const filter = {
    isOpen: false,
    init: async() => {
        await packet.init();
        await mark.init();
        color.init();
        distance.init();
        fuel.init();
        transmission.init();
        rating.init();
        power.init();
        doors.init();
        seats.init();
        year.init();
        filter.update();
    },
    submit: () => {

        packet.onSubmit();
        mark.onSubmit();
        model.onSubmit();
        color.onSubmit();
        distance.onSubmit();
        fuel.onSubmit();
        transmission.onSubmit();
        rating.onSubmit();
        power.onSubmit();
        doors.onSubmit();
        seats.onSubmit();
        year.onSubmit();
        if (window.location.href != url.href)
            window.location.href = url.href;
    },
    reset: () => {
        packet.reset();
        mark.reset();
        color.reset();
        distance.reset();
        fuel.reset();
        transmission.reset();
        rating.reset();
        power.reset();
        doors.reset();
        seats.reset();
        year.reset();
        filter.update();
    },
    toggle: () => {
        $(".filter-section").slice(3).toggle();
        filter.isOpen = !filter.isOpen;
        $("#more-options-button").text((filter.isOpen) ? filterLang["filter-less-btn"][language.lang] : filterLang["filter-more-btn"][language.lang]);
    },
    update: () => {
        packet.update();
        mark.update();
        model.update();
        color.update();
        distance.update();
        fuel.update();
        transmission.update();
        rating.update();
        power.update();
        doors.update();
        seats.update();
        year.update();
    },
}
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/