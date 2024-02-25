import { url } from "../utils/general";
export const distance = {
    name: "distance",
    section: null,
    dropdown: null,
    element: null,
    values: null,
    valueName: null,
    items: null,
    itemNames: null,
    query: null,
    init: () => {
        distance.section = document.getElementById(`${distance.name}`);
        distance.dropdown = new Choices(distance.section, {
            removeItemButton: true,
            duplicateItemsAllowed: false,
            editItems: true,
            searchEnabled: false,
            searchChoices: false,
            shouldSort: false,
            allowHTML: true,
        });
        distance.element = distance.dropdown.passedElement.element.parentElement;
        const queryString = url.searchParams.get(distance.name);
        distance.query = (queryString) ? queryString.split(",") : [];
        
        distance.loadListeners();
        distance.setValue(distance.query);
    },
    hasValue: () => (distance.values != undefined),
    addListener: (type, fun) => {
        distance.section.addEventListener(type, fun);
    },
    update: () => {
        distance.values = distance.dropdown.getValue();
        distance.valueName = (distance.values) ? distance.values.value : "";
        distance.items = distance.dropdown._currentState.choices.filter((item, index, self) => distance.valueName != item.value && index === self.findIndex((i) => (i.value === item.value)));;
        distance.itemNames = distance.items.map(item => item.value);
    },
    onSubmit: () => {
        if (distance.hasValue() && distance.valueName != "All")
            url.searchParams.set(distance.name, distance.valueName);
        else
            url.searchParams.delete(distance.name);
    },
    loadListeners: () => {
        distance.addListener('change', (event) => {
            distance.update();
        });
        distance.addListener('highlightItem', (event) => {
            distance.update();
        });
    },
    setValue: (value) => {
        distance.dropdown._findAndSelectChoiceByValue(value[0])

    },
    reset: () => {
        distance.setValue(["All"]);
    },
    toggle: () => {
        distance.section.style.display = "block"
    }
}
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/