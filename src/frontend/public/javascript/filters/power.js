import { url } from "../utils/general";
export const power = {
    name: "power",
    section: null,
    dropdown: null,
    element: null,
    values: null,
    valueName: null,
    items: null,
    itemNames: null,
    query: null,
    init: () => {
        power.section = document.getElementById(`${power.name}`);
        power.dropdown = new Choices(power.section, {
            removeItemButton: true,
            duplicateItemsAllowed: false,
            editItems: true,
            searchEnabled: false,
            searchChoices: false,
            shouldSort: false,
            allowHTML: true,
        });
        power.element = power.dropdown.passedElement.element.parentElement;
        const queryString = url.searchParams.get(power.name);
        power.query = (queryString) ? queryString.split(",") : [];

        power.loadListeners();
        power.setValue(power.query);
    },
    hasValue: () => (power.values != undefined),
    addListener: (type, fun) => {
        power.section.addEventListener(type, fun);
    },
    update: () => {
        power.values = power.dropdown.getValue();
        power.valueName = (power.values) ? power.values.value : "";
        power.items = power.dropdown._currentState.choices.filter((item, index, self) => power.valueName != item.value && index === self.findIndex((i) => (i.value === item.value)));;
        power.itemNames = power.items.map(item => item.value);
    },
    onSubmit: () => {
        if (power.hasValue() && power.valueName != "All")
            url.searchParams.set(power.name, power.valueName);
        else
            url.searchParams.delete(power.name);
    },
    loadListeners: () => {
        power.addListener('change', (event) => {
            power.update();
        });
        power.addListener('highlightItem', (event) => {
            power.update();
        });
    },
    setValue: (value) => {
        power.dropdown._findAndSelectChoiceByValue(value[0])
    },
    reset: () => {
        power.setValue(["All"]);
    },
    toggle: () => {
        power.section.style.display = "block"
    }
}
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/