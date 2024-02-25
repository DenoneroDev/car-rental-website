import { url } from "../utils/general";
export const doors = {
    name: "doors",
    section: null,
    dropdown: null,
    element: null,
    values: null,
    valueName: null,
    items: null,
    itemNames: null,
    query: null,
    init: () => {
        doors.section = document.getElementById(`${doors.name}`);
        doors.dropdown = new Choices(doors.section, {
            removeItemButton: true,
            duplicateItemsAllowed: false,
            editItems: true,
            searchEnabled: false,
            searchChoices: false,
            shouldSort: false,
            allowHTML: true,
        });
        doors.element = doors.dropdown.passedElement.element.parentElement;
        const queryString = url.searchParams.get(doors.name);
        doors.query = (queryString) ? queryString.split(",") : [];

        doors.loadListeners();
        doors.setValue(doors.query);
    },
    hasValue: () => (doors.values != undefined),
    addListener: (type, fun) => {
        doors.section.addEventListener(type, fun);
    },
    update: () => {
        doors.values = doors.dropdown.getValue();
        doors.valueName = (doors.values) ? doors.values.value : "";
        doors.items = doors.dropdown._currentState.choices.filter((item, index, self) => doors.valueName != item.value && index === self.findIndex((i) => (i.value === item.value)));;
        doors.itemNames = doors.items.map(item => item.value);
    },
    onSubmit: () => {
        if (doors.hasValue() && doors.valueName != "All")
            url.searchParams.set(doors.name, doors.valueName.replace(" Doors", ""));
        else
            url.searchParams.delete(doors.name);
    },
    loadListeners: () => {
        doors.addListener('change', (event) => {
            doors.update();
        });
        doors.addListener('highlightItem', (event) => {
            doors.update();
        });
    },
    setValue: (value) => {
        doors.dropdown._findAndSelectChoiceByValue((value[0] === "All") ? value[0] : value[0] + " Doors")
    },
    reset: () => {
        doors.setValue(["All"]);
    },
    toggle: () => {
        doors.section.style.display = "block"
    }
}
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/