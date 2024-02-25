import { url } from "../utils/general";
export const fuel = {
    name: "fuel",
    section: null,
    dropdown: null,
    element: null,
    values: null,
    valueName: null,
    items: null,
    itemNames: null,
    query: null,
    init: () => {
        fuel.section = document.getElementById(`${fuel.name}`);
        fuel.dropdown = new Choices(fuel.section, {
            removeItemButton: true,
            duplicateItemsAllowed: false,
            searchEnabled: false,
            searchChoices: false,
            allowHTML: true,
        });
        fuel.element = fuel.dropdown.passedElement.element.parentElement;
        const queryString = url.searchParams.get(fuel.name);
        fuel.query = (queryString) ? queryString.split(",") : [];

        fuel.loadListeners();
        fuel.setValue(fuel.query);
    },
    hasValue: () => (fuel.values != undefined),
    addListener: (type, fun) => {
        fuel.section.addEventListener(type, fun);
    },
    update: () => {
        fuel.values = fuel.dropdown.getValue();
        fuel.valueName = (fuel.values) ? fuel.values.value : "";
        fuel.items = fuel.dropdown._currentState.choices.filter((item, index, self) => fuel.valueName != item.value && index === self.findIndex((i) => (i.value === item.value)));;
        fuel.itemNames = fuel.items.map(item => item.value);
    },
    onSubmit: () => {
        if (fuel.hasValue() && fuel.valueName != "All")
            url.searchParams.set(fuel.name, fuel.valueName);
        else
            url.searchParams.delete(fuel.name);
    },
    loadListeners: () => {
        fuel.addListener('change', (event) => {
            fuel.update();
        });
        fuel.addListener('highlightItem', (event) => {
            fuel.update();
        });
    },
    setValue: (value) => {
        fuel.dropdown._findAndSelectChoiceByValue(value[0])
    },
    reset: () => {
        fuel.setValue(["All"]);
    },
    toggle: () => {
        fuel.section.style.display = "block"
    }
}
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/