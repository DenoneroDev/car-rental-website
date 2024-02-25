import { url } from "../utils/general";
export const year = {
    name: "years",
    section: null,
    dropdown: null,
    element: null,
    values: null,
    valueNames: null,
    items: [],
    itemNames: ["All"],
    query: null,
    init: () => {
        year.section = document.getElementById(`${year.name}`);
        year.dropdown = new Choices(year.section, {
            removeItemButton: true,
            duplicateItemsAllowed: false,
            editItems: true,
            searchEnabled: false,
            searchChoices: false,
            shouldSort: false,
            allowHTML: true,
        });
        year.element = year.dropdown.passedElement.element.parentElement;
        const queryString = url.searchParams.get(year.name);
        year.query = (queryString) ? queryString.split(",") : [];

        const currentYear = new Date().getFullYear();

        for (let i = currentYear; i >= 1990; i--)
            year.itemNames.push(i.toString());

        year.loadListeners();
        year.addItems(year.itemNames);
        year.setValue(year.query);
    },
    hasValue: () => (year.values.length > 0),
    addListener: (type, fun) => {
        year.section.addEventListener(type, fun);
    },
    setPlaceHolder: (value) => {
        year.dropdown.input.placeholder = value;
        year.dropdown.input.setWidth(3);
    },
    clearPlaceHolder: () => {
        year.setPlaceHolder("");
    },
    update: () => {
        year.values = year.dropdown.getValue();
        year.valueNames = year.values.map(value => value.value);
        year.items = year.dropdown._currentState.choices.filter((item, index, self) => !year.valueNames.includes(item.value) && index === self.findIndex((i) => (i.value === item.value)));;
        year.itemNames = year.items.map(item => item.value);
    
        year.clearPlaceHolder();
        if (!year.hasValue())
            year.setPlaceHolder("All");
    },
    onSubmit: () => {
        if (year.hasValue())
            url.searchParams.set(year.name, year.valueNames);
        else
            url.searchParams.delete(year.name);
    },
    loadListeners: () => {
        year.addListener('change', (event) => {
            year.update();
        });
        year.addListener('highlightItem', (event) => {
            year.update();
        });
    },
    addItems: (values) => {
        values.forEach(value => {
            const newItem = {
                value: value,
                label: value,
                placeholder: (value === "All"),
            };
            year.items.push(newItem);
        });
        year.dropdown.setChoices(year.items, 'value', 'label', true);
    },
    setValue: (values) => {
        values.forEach(value => {
            year.dropdown._findAndSelectChoiceByValue(value);
        });
    },
    reset: () => {
        year.dropdown.removeActiveItems();
    },
    toggle: () => {
        year.section.style.display = "block";
    }
}
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/