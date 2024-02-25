import { url } from "../utils/general";
export const rating = {
    name: "rating",
    section: null,
    dropdown: null,
    element: null,
    values: null,
    valueName: null,
    items: null,
    itemNames: null,
    query: null,
    init: () => {
        rating.section = document.getElementById(`${rating.name}`);
        rating.dropdown = new Choices(rating.section, {
            removeItemButton: true,
            duplicateItemsAllowed: false,
            editItems: true,
            searchEnabled: false,
            searchChoices: false,
            allowHTML: true,
        });
        rating.element = rating.dropdown.passedElement.element.parentElement;
        const queryString = url.searchParams.get(rating.name);
        rating.query = (queryString) ? queryString.split(",") : [];

        rating.loadListeners();
        rating.setValue(rating.query);
    },
    hasValue: () => (rating.values != undefined),
    addListener: (type, fun) => {
        rating.section.addEventListener(type, fun);
    },
    update: () => {
        rating.values = rating.dropdown.getValue();
        rating.valueName = (rating.values) ? rating.values.value : "";
        rating.items = rating.dropdown._currentState.choices.filter((item, index, self) => rating.valueName != item.value && index === self.findIndex((i) => (i.value === item.value)));;
        rating.itemNames = rating.items.map(item => item.value);
    },
    onSubmit: () => {
        if (rating.hasValue() && rating.valueName != "All")
            url.searchParams.set(rating.name, rating.valueName.replace(" Stars", "").replace(" Star", ""));
        else
            url.searchParams.delete(rating.name);
    },
    loadListeners: () => {
        rating.addListener('change', (event) => {
            rating.update();
        });
        rating.addListener('highlightItem', (event) => {
            rating.update();
        });
    },
    setValue: (value) => {
        rating.dropdown._findAndSelectChoiceByValue((value[0] === "All") ? value[0] : (value[0] == 1) ? value[0] + " Star" : value[0] + " Stars");
    },
    reset: () => {
        rating.setValue(["All"]);
    },
    toggle: () => {
        rating.section.style.display = "block"
    }
}
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/