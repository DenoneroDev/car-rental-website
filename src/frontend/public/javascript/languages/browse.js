import { headerLang } from "./header";
import { filterLang } from "./filter";
import { $cars, cars } from "../utils/general";
import { Article } from "../elements/article";
export const browseLang = {
    ...headerLang,
    "filter-button": {
        en: "Update",
        de: "Aktualisieren",
        cs: "Aktualizovat"
    },
    "car-button": {
        en: "Rent this car",
        de: "Dieses Auto mieten",
        cs: "Vypůjčte si toto auto."
    },
    ...filterLang,
    "pagination-previous": {
        en: "Back",
        de: "Zurück",
        cs: "Zpět"
    },
    "pagination-go": {
        en: "Go",
        de: "Los",
        cs: "Jděte"
    },
    "pagination-next": {
        en: "Next",
        de: "Weiter",
        cs: "Další"
    },
    special: () => {
        $cars.html("");
        for (const car of cars) {
            const articleCard = new Article(car);
            $cars.append(articleCard.render());
        }
    }
};
