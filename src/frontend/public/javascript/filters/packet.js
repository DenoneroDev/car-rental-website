const $filterPackets = $("#packets");
let packets;
import { url } from "../utils/general";

export const packet = {
    name: "packets",
    section: null,
    dropdown: null,
    element: null,
    values: null,
    valueNames: null,
    items: null,
    itemNames: null,
    query: null,
    ids: [],
    init: async () => {

        packets = await $.ajax({
            url: "/api/packets",
            type: "GET",
            data: {},
            error: () => {
                console.log("Internal Server Error");
            }
        });
        for (const packet of packets) {
            const html = `<option class="filter-selector" value="${packet.title}">${packet.title}</option>`;
            $filterPackets.append(html);
        }

        packet.section = document.getElementById(`${packet.name}`);
        packet.dropdown = new Choices(packet.section, {
            removeItemButton: true,
            maxItemCount: 5,
            duplicateItemsAllowed: false,
            allowHTML: true,
        });
        packet.element = packet.dropdown.passedElement.element.parentElement;
        const queryString = url.searchParams.get(packet.name);
        packet.query = (queryString) ? queryString.split(",") : [];

        packet.loadListeners();
        packet.setValue(packet.query.map(id => {
            const packet = packets.find(packet => packet._id === id);
            return packet ? packet.title : null;
        }));
    },
    hasValue: () => packet.values.length > 0,
    setPlaceHolder: (value) => {
        packet.dropdown.input.placeholder = value;
        packet.dropdown.input.setWidth(3);
    },
    clearPlaceHolder: () => {
        packet.setPlaceHolder("");
    },
    addListener: (type, fun) => {
        packet.section.addEventListener(type, fun);
    },
    update: () => {
        packet.values = packet.dropdown.getValue();
        packet.valueNames = packet.values.map(value => value.value);
        packet.ids = packet.valueNames.map(title => {
            const packet = packets.find(packet => packet.title === title);
            return packet ? packet._id : null;
        });
        packet.items = packet.dropdown._currentState.choices.filter((item, index, self) => !packet.valueNames.includes(item.value) && index === self.findIndex((i) => (i.value === item.value)));;
        packet.itemNames = packet.items.map(item => item.value);

        packet.clearPlaceHolder();
        if (!packet.hasValue())
            packet.setPlaceHolder("All");
    },
    onSubmit: () => {
        if (packet.hasValue())
            url.searchParams.set(packet.name, packet.ids);
        else
            url.searchParams.delete(packet.name);
    },
    loadListeners: () => {
        packet.addListener('change', (event) => {
            packet.update();
        });
    },
    setValue: (values) => {
        values.forEach(value => {
            packet.dropdown._findAndSelectChoiceByValue(value)
        });
    },
    reset: () => {
        packet.dropdown.removeActiveItems();
    }
}
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/