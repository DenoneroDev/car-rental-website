import { url } from "../utils/general";
export const seats = {
    name: "seats",
    section: null,
    dropdown: null,
    element: null,
    values: null,
    valueName: null,
    items: null,
    itemNames: null,
    query: null,
    init: () => {
        seats.section = document.getElementById(`${seats.name}`);
        seats.dropdown = new Choices(seats.section, {
            removeItemButton: true,
            duplicateItemsAllowed: false,
            editItems: true,
            searchEnabled: false,
            searchChoices: false,
            shouldSort: false,
            allowHTML: true,
        });
        seats.element = seats.dropdown.passedElement.element.parentElement;
        const queryString = url.searchParams.get(seats.name);
        seats.query = (queryString) ? queryString.split(",") : [];

        seats.loadListeners();
        seats.setValue(seats.query);
    },
    hasValue: () => (seats.values != undefined),
    addListener: (type, fun) => {
        seats.section.addEventListener(type, fun);
    },
    update: () => {
        seats.values = seats.dropdown.getValue();
        seats.valueName = (seats.values) ? seats.values.value : "";
        seats.items = seats.dropdown._currentState.choices.filter((item, index, self) => seats.valueName != item.value && index === self.findIndex((i) => (i.value === item.value)));;
        seats.itemNames = seats.items.map(item => item.value);
    },
    onSubmit: () => {
        if (seats.hasValue() && seats.valueName != "All")
            url.searchParams.set(seats.name, seats.valueName.replace(" Seats", ""));
        else
            url.searchParams.delete(seats.name);
    },
    loadListeners: () => {
        seats.addListener('change', (event) => {
            seats.update();
        });
        seats.addListener('highlightItem', (event) => {
            seats.update();
        });
    },
    setValue: (value) => {
        seats.dropdown._findAndSelectChoiceByValue((value[0] === "All") ? value[0] : value[0] + " Seats")
    },
    reset: () => {
        seats.setValue(["All"]);
    },
    toggle: () => {
        seats.section.style.display = "block"
    }
}
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/