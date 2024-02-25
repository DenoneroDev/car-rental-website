import { url } from "../utils/general";
export const model = {
    name: "models",
    section: null,
    dropdown: null,
    element: null,
    values: null,
    valueNames: null,
    items: [],
    itemNames: [],
    query: null,
    init: () => {
        model.section = document.getElementById(`${model.name}`);
        model.dropdown = new Choices(model.section, {
            removeItemButton: true,
            duplicateItemsAllowed: false,
            allowHTML: true,
        });
        model.element = model.dropdown.passedElement.element.parentElement;
        const queryString = url.searchParams.get(model.name);
        model.query = (queryString) ? queryString.split(",") : [];
        
        model.loadListeners();
    },
    hasValue: () => model.values.length > 0,
    isEmpty: () => (model.values.length <= 0 && model.items.length <= 0),
    setPlaceHolder: (value) => {
        model.dropdown.input.placeholder = value;
        model.dropdown.input.setWidth(3);
    },
    clearPlaceHolder: () => {
        model.setPlaceHolder("");
    },
    addListener: (type, fun) => {
        model.section.addEventListener(type, fun);
    },
    update: () => {
        model.values = model.dropdown.getValue();
        model.valueNames = model.values.map(value => value.value);
        model.items = model.dropdown._currentState.choices.filter((item, index, self) => !model.valueNames.includes(item.value) && index === self.findIndex((i) => (i.value === item.value)));
        model.itemNames = model.items.map(item => item.value);

        model.clearPlaceHolder();
        if (!model.hasValue())
            model.setPlaceHolder("All");
        if (model.isEmpty())
            model.disable();
    },
    loadListeners: () => {
        model.addListener('change', (event) => {
            model.update();
        });
    },
    onSubmit: () => {
        if (model.hasValue())
            url.searchParams.set(model.name, model.valueNames);
        else
            url.searchParams.delete(model.name);
    },
    addItems: (values) => {
        values.forEach(value => {
            const newItem = {
                value: value,
                label: value
            };
            model.itemNames.push(value);
            model.items.push(newItem);
        });
        model.dropdown.setChoices(model.items, 'value', 'label', true);
        model.dropdown.enable();
    },
    setValue: (values) => {
        values.forEach(value => {
            model.dropdown._findAndSelectChoiceByValue(value);
        });
    },
    remove: (values) => {

        values.forEach(value => {
            const index = model.dropdown._currentState.choices.findIndex(item => item.value === value);

            if (index !== -1)
                model.dropdown._currentState.choices.splice(index, 1);

            const optionElement = document.querySelector(`.choices__item[data-value="${value}"]`);

            if (optionElement) {
                model.dropdown._currentState.items = model.dropdown._currentState.items.filter(item => item.value !== value);
                optionElement.remove();
            }
        });

        if (model.isEmpty())
            model.disable();
            

    },
    disable: () => {
        model.dropdown.clearChoices();
        model.dropdown.hideDropdown();
        model.dropdown.disable();
        model.setPlaceHolder("All");
    }
}
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/