const $info = $("#info");
import { headerLang } from "./header";
import { reloadRatings } from "../utils/rating";
import { convertDate, car, loadQuill } from "../utils/general";
import { language } from "../languages/language";
import {rateLang} from "../languages/rate";
import { $detailTable, $detailArea, $packets, carPackets } from "../car";
import { CarDetailsTable } from "../elements/carDetails";
import { Packet } from "../elements/packet";

export const carLang = {
    ...headerLang,
    "button": {
        en: "rent this car",
        de: "diesen Wagen mieten",
        cs: "pronajměte si toto auto"
    },
    "info-description-title": {
        en: "Description",
        de: "Beschreibung",
        cs: "Popis"
    },
    "info-details-title": {
        en: "Details",
        de: "Informationen",
        cs: "Podrobnosti"
    },
    "info-mark-title": {
        en: "Brand",
        de: "Marke",
        cs: "Značka"
    },
    "info-model-title": {
        en: "Modell",
        de: "Modell",
        cs: "Model"
    },
    "info-color-title": {
        en: "Color",
        de: "Farbe",
        cs: "Barva"
    },
    "info-fuel-title": {
        en: "Fuel",
        de: "Kraftstoff",
        cs: "Palivo"
    },
    "info-transmission-title": {
        en: "Transmission",
        de: "Getriebe",
        cs: "Převodovka"
    },
    "info-year-title": {
        en: "Year",
        de: "Jahr",
        cs: "Rok"
    },
    "info-power-title": {
        en: "Power",
        de: "Leistung",
        cs: "Výkon"
    },
    "info-distance-title": {
        en: "Distance",
        de: "Entfernung",
        cs: "Vzdálenost"
    },
    "info-doors-title": {
        en: "Doors",
        de: "Türe",
        cs: "Dveře"
    },
    "info-seats-title": {
        en: "Seats",
        de: "Sitze",
        cs: "Sedadla"
    },
    "info-packets-title": {
        en: "Packets",
        de: "Pakete",
        cs: "Balíčky"
    },
    "packet-days": {
        en: "day(s)",
        de: "Tag(e)",
        cs: "den/dny"
    },
    "rate-title": {
        en: "Rate this car",
        de: "Bewerte dieses Auto",
        cs: "Ohodnoťte toto auto."
    },
    "info": null,
    ...rateLang,
    special: () => {
        reloadRatings();
        carLang.info = {
            en: `<img src="/images/info.png"> Available again on: ${convertDate(car.rentedUntil)}`,
		    de: `<img src="/images/info.png"> Wieder verfügbar am: ${ convertDate(car.rentedUntil)}`,
            cs: `<img src="/images/info.png"> Opět k dispozici na: ${convertDate(car.rentedUntil)}`,
        }
        loadQuill(language.lang == "en" ? car.description : car[language.lang].description);
        $detailTable.remove();
        $detailArea.append(new CarDetailsTable(car).render());
        $detailTable = $("#detail-area table");
        $packets.html("");
        for (const packet of carPackets)
            $packets.append(new Packet(packet).render());
    }
};