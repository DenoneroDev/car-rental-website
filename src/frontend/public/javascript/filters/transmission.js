import { url } from "../utils/general";
export const transmission = {
    name: "transmission",
    section: null,
    dropdown: null,
    element: null,
    values: null,
    valueName: null,
    items: null,
    itemNames: null,
    query: null,
    init: () => {
        transmission.section = document.getElementById(`${transmission.name}`);
        transmission.dropdown = new Choices(transmission.section, {
            removeItemButton: true,
            duplicateItemsAllowed: false,
            searchEnabled: false,
            searchChoices: false,
            allowHTML: true,
        });
        transmission.element = transmission.dropdown.passedElement.element.parentElement;
        const queryString = url.searchParams.get(transmission.name);
        transmission.query = (queryString) ? queryString.split(",") : [];

        transmission.loadListeners();
        transmission.setValue(transmission.query);
    },
    hasValue: () => (transmission.values),
    addListener: (type, fun) => {
        transmission.section.addEventListener(type, fun);
    },
    update: () => {
        transmission.values = transmission.dropdown.getValue();
        transmission.valueName = (transmission.values) ? transmission.values.value : "";
        transmission.items = transmission.dropdown._currentState.choices.filter((item, index, self) => transmission.valueName != item.value && index === self.findIndex((i) => (i.value === item.value)));;
        transmission.itemNames = transmission.items.map(item => item.value);
    },
    onSubmit: () => {
        if (transmission.hasValue() && transmission.valueName != "All")
            url.searchParams.set(transmission.name, transmission.valueName);
        else
            url.searchParams.delete(transmission.name);
    },
    loadListeners: () => {
        transmission.addListener('change', (event) => {
            transmission.update();
        });
        transmission.addListener('highlightItem', (event) => {
            transmission.update();
        });
    },
    setValue: (value) => {
        transmission.dropdown._findAndSelectChoiceByValue(value[0])
    },
    reset: () => {
        transmission.setValue(["All"]);
    },
    toggle: () => {
        transmission.section.style.display = "block"
    }
}
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/