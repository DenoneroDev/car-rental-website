import { $cars, cars } from "../utils/general";
import { Article } from "../elements/article";
import { headerLang } from "./header"

export const favoritesLang = {
    ...headerLang,
    "error": {
        en: "Hmm.. You don't have saved cars!",
        de: "Hmm.. Sie haben keine Fahrzeuge gespeichert!",
        cs: "Hm... Nemáte uložená auta!"
    },
    "car-button": {
        en: "Rent this car",
        de: "Dieses Auto mieten",
        cs: "Pronajměte si toto auto."
    },
    special: () => {
        $cars.html("");
        for (const car of cars) {
            const articleCard = new Article(car);
            $cars.append(articleCard.render());
        }
    }
};
