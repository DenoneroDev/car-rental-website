const $filterMarks = $("#marks");
const marks = {};
import { url } from "../utils/general";
import {model} from "./model";
export const mark = {
    name: "marks",
    section: null,
    dropdown: null,
    element: null,
    values: null,
    valueNames: null,
    items: null,
    itemNames: null,
    query: null,
    init: async () => {
        const allMarks = await $.ajax({
            url: "/api/marks",
            type: "GET",
            error: () => {
                console.log("Internal Server Error");
            }
        });
        for (const mark of allMarks) {
            marks[mark.name] = mark.models;
            const html = `<option class="filter-selector" value="${mark.name}">${mark.name}</option>`;
            $filterMarks.append(html);
        }
        mark.section = document.getElementById(`${mark.name}`);
        mark.dropdown = new Choices(mark.section, {
            removeItemButton: true,
            duplicateItemsAllowed: false,
            allowHTML: true,
        });
        mark.element = mark.dropdown.passedElement.element.parentElement;
        const queryString = url.searchParams.get(mark.name);
        mark.query = (queryString) ? queryString.split(",") : [];

        mark.loadListeners();
        model.init();
        mark.setValue(mark.query);
        model.setValue(model.query);
    },
    hasValue: () => mark.values.length > 0,
    setPlaceHolder: (value) => {
        mark.dropdown.input.placeholder = value;
        mark.dropdown.input.setWidth(3);
    },
    clearPlaceHolder: () => mark.setPlaceHolder(""),
    addListener: (type, fun) => mark.section.addEventListener(type, fun),
    update: () => {
        mark.values = mark.dropdown.getValue();
        mark.valueNames = mark.values.map(value => value.value);
        mark.items = mark.dropdown._currentState.choices.filter((item, index, self) => !mark.valueNames.includes(item.value) && index === self.findIndex((i) => (i.value === item.value)));;
        mark.itemNames = mark.items.map(item => item.value);

        mark.clearPlaceHolder();
        if (!mark.hasValue())
            mark.setPlaceHolder("All");
    },
    loadListeners: () => {
        mark.addListener("removeItem", (event) => {
            model.dropdown.hideDropdown();
            model.remove(marks[event.detail.value]);
            model.update();
            mark.update();
        });
        mark.addListener("addItem", (event) => {
            model.addItems(marks[event.detail.value]);
            model.update();
            mark.update();
        });
    },
    onSubmit: () => {
        if (mark.hasValue())
            url.searchParams.set(mark.name, mark.valueNames);
        else
            url.searchParams.delete(mark.name);
    },
    setValue: (values) => {
        values.forEach(value => {
            mark.dropdown._findAndSelectChoiceByValue(value);
        });
    },
    reset: () => {
        mark.dropdown.removeActiveItems();
    }
}
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/