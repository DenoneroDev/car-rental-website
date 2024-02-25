import { headerLang } from "./header";
import { filterLang } from "./filter";
import { reConfigureSwiper } from "../home";
import { cars, $cars } from "../utils/general";
import { Article } from "../elements/article";
export const homeLang = {
    ...headerLang,
    "landing-title": {
        en: "Experience seamless journeys with our premier car rental services, tailored to make every mile memorable.",
        de: "Erleben Sie nahtlose Reisen mit unseren erstklassigen Mietwagenservices, maßgeschneidert, um jede Meile unvergesslich zu gestalten.",
        cs: "Zažijte bezproblémové cesty s našimi prvotřídními službami pronájmu aut, šitémi tak, aby každý ujetý kilometr byl nezapomenutelný."
    },
    ...filterLang,
    "popular-cars-title": {
        en: "Most popular cars",
        de: "Die beliebtesten Autos",
        cs: "Nejoblíbenější auta",
    },
    "filter-button": {
        en: "Search",
        de: "Suche",
        cs: "Hledat"
    },
    "car-button": {
        en: "Rent this car",
        de: "Dieses Auto mieten",
        cs: "Pronajmout si toto auto"
    },
    "popular-cars-button": {
        en: "Show all cars",
        de: "Alle Autos anzeigen",
        cs: "Zobrazit všechna auta"
    },
    "choose-us-title": {
        en: "Why choose us?",
        de: "Warum uns wählen?",
        cs: "Proč si vybrat nás?"
    },
    "choose-us-title-long": {
        en: "We offer the best experience",
        de: "Wir bieten Ihnen das beste Erlebnis",
        cs: "Nabízíme tu nejlepší zkušenost."
    },
    "choose-us-price-title": {
        en: "The best price",
        de: "Der beste Preis",
        cs: "Nejlepší cena"
    },
    "choose-us-price-description": {
        en: "We pride ourselves on offering the best prices in the industry.",
        de: "Wir sind stolz darauf, die besten Preise in der Branche anzubieten.",
        cs: "Hrdě se pyšníme tím, že nabízíme nejlepší ceny v průmyslu."
    },
    "choose-us-support-title": {
        en: "24/7 technical support",
        de: "24/7 technischer Support",
        cs: "Technická podpora 24/7"
    },
    "choose-us-support-description": {
        en: "Have a question? Contact VM MAXIMA CAR support anytime when you have a problem.",
        de: "Haben Sie eine Frage? Kontaktieren Sie den VM MAXIMA CAR Support jederzeit, wenn Sie ein Problem haben.",
        cs: "Máte otázku? Kontaktujte podporu společnosti VM MAXIMA CAR kdykoli, když máte problém."
    },
    "choose-us-quality-title": {
        en: "Good quality",
        de: "Gute Qualität",
        cs: "Kvalita"
    },
    "choose-us-quality-description": {
        en: "Our rigorous inspection process ensures that every car we have is in top condition.",
        de: "Unser strenger Inspektionsprozess stellt sicher, dass jedes Auto, das wir haben, sich in Top-Zustand befindet.",
        cs: "Náš přísný proces inspekce zaručuje, že každé auto, které máme, je v špičkovém stavu."
    },
    "steps-title": {
        en: "Together, we can find the perfect car that matches your dreams.",
        de: "Gemeinsam finden wir das perfekte Auto, das Ihren Träumen entspricht.",
        cs: "Společně můžeme najít perfektní auto, které odpovídá vašim snům."
    },
    "step-one-title": {
        en: "Choose the car!",
        de: "Wählen Sie das Auto!",
        cs: "Vyberte si auto!"
    },
    "step-one-description": {
        en: "Please feel free to contact us if you don't find anything. We will inform you about new offers!",
        de: "Bitte kontaktieren Sie uns, wenn Sie nichts finden. Wir informieren Sie über neue Angebote!",
        cs: "Neváhejte nás kontaktovat, pokud nenajdete to, co hledáte. Budeme vás informovat o nových nabídkách!"
    },
    "step-two-title": {
        en: "Share it with us!",
        de: "Teilen Sie es mit uns!",
        cs: "Sdílejte to s námi!"
    },
    "step-two-description": {
        en: "In a personal conversation, we will gather your wishes and provide you with an offer!",
        de: "In einem persönlichen Gespräch sammeln wir Ihre Wünsche und unterbreiten Ihnen ein Angebot!",
        cs: "V osobním rozhovoru se seznámíme s vašimi přáními a připravíme vám nabídku!"
    },
    "step-three-title": {
        en: "Payment!",
        de: "Bezahlung!",
        cs: "Platba!"
    },
    "step-three-description": {
        en: "You can choose from a variety of payment options. You can obtain further information from our support.",
        de: "Sie können aus einer Vielzahl von Zahlungsoptionen wählen. Weitere Informationen erhalten Sie von unserem Support.",
        cs: "Můžete si vybrat z různých platebních možností. Další informace získáte od naší podpory."
    },
    "step-four-title": {
        en: "Have a good trip!",
        de: "Gute Reise!",
        cs: "Přeji hezkou cestu!"
    },
    "step-four-description": {
        en: "We hope you have a safe journey and stay healthy! We're delighted to assist you even after renting your car!",
        de: "Wir wünschen Ihnen eine sichere Reise und bleiben Sie gesund! Wir sind auch nach der Anmietung Ihres Autos gerne für Sie da!",
        cs: "Doufáme, že máte bezpečnou cestu a zůstanete zdraví! Jsme rádi, že vám můžeme pomoci i po pronájmu auta!"
    },
    special: () => {
        $cars.html("");
        for (const car of cars) {
            const articleCard = new Article(car);
            $cars.append(articleCard.render());
        }
        reConfigureSwiper();
    }
};