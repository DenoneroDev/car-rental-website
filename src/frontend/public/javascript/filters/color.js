import { url } from "../utils/general";
export const color = {
    name: "colors",
    section: null,
    dropdown: null,
    element: null,
    values: null,
    valueNames: null,
    items: null,
    itemNames: null,
    query: null,
    colorMap: new Map(),
    blackSvgUrl: "data:image/svg+xml;base64,",
    whiteSvgUrl: "data:image/svg+xml;base64,",
    init: () => {
        color.section = document.getElementById(`${color.name}`);
        color.dropdown = new Choices(color.section, {
            removeItemButton: true,
            duplicateItemsAllowed: false,
            shouldSort: false,
            allowHTML: true,
        });
        color.element = color.dropdown.passedElement.element.parentElement;
        const queryString = url.searchParams.get(color.name);
        color.query = (queryString) ? queryString.split(",") : [];
        const colors = ["#ffffff", "#000000", "#f3dfba", "#c3111f", "#0083c3", "#bababa", "#c0c0c0", "#ffea00", "#009100", "#5e4532", "#ba8551", "#e4c960", "#e89319", "#6c005e"];
        color.blackSvgUrl += btoa('<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21"><path d="M2.592.044l18.364 18.364-2.548 2.548L.044 2.592z"/><path d="M0 18.364L18.364 0l2.548 2.548L2.548 20.912z"/></svg>');
        color.whiteSvgUrl += btoa('<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21"><path d="M2.592.044l18.364 18.364-2.548 2.548L.044 2.592z" fill="#FFF"/><path d="M0 18.364L18.364 0l2.548 2.548L2.548 20.912z" fill="#FFF"/></svg>');

        $($('.choices__list').get(10)).find('.choices__item').each((index, value) => {
            const hex = colors[index];
            $(value).css("color", color.getContrast(hex));
            $(value).css("background-color", hex);
            color.colorMap.set(color.hashString($(value).attr("data-value")), hex);
        });
        color.loadListeners();
        color.setValue(color.query);

    },
    hasValue: () => color.values.length > 0,
    hasItem: () => color.items.length > 0,
    setPlaceHolder: (value) => {
        color.dropdown.input.placeholder = value;
        color.dropdown.input.setWidth(3);
    },
    clearPlaceHolder: () => {
        color.setPlaceHolder("");
    },
    addListener: (type, fun) => {
        color.section.addEventListener(type, fun);
    },
    update: () => {
        color.values = color.dropdown.getValue();
        color.valueNames = color.values.map(value => value.value);
        color.items = color.dropdown._currentState.choices.filter((item, index, self) => !color.valueNames.includes(item.value) && index === self.findIndex((i) => (i.value === item.value)));;
        color.itemNames = color.items.map(item => item.value);

        setTimeout(() => {
            if (color.hasItem()) {
                $($('.choices__list').get(10)).find('.choices__item').each((index, value) => {
                    const hex = color.colorMap.get(color.hashString($(value).attr("data-value")));
    
                    $(value).css("background-color", hex);
                    $(value).css("color", color.getContrast(hex));
                });
            }
            if (color.hasValue()) {
                $($('.choices__list').get(9)).find('.choices__item').each((index, value) => {
                    const hex = color.colorMap.get(color.hashString($(value).attr("data-value")));
    
                    $(value).css("background-color", hex);
                    $(value).css("color", color.getContrast(hex));
                    $($(value).find("button")).css("background-image", `url(${color.getContrast(hex, "image")})`);
                    $($(value).find("button")).css("border-left", `1px solid ${color.getContrast(hex)}`);
                });
            }
        }, 0);
        color.clearPlaceHolder();
        if (!color.hasValue())
            color.setPlaceHolder("All");
    },
    onSubmit: () => {
        if (color.hasValue())
            url.searchParams.set(color.name, color.valueNames);
        else
            url.searchParams.delete(color.name);
    },
    loadListeners: () => {
        color.addListener('change', (event) => {
            color.update();
        });
        color.addListener('highlightItem', (event) => {
            color.update();
        });
    },
    setValue: (values) => {
        values.forEach(value => {
            color.dropdown._findAndSelectChoiceByValue(value)
        });
    },
    reset: () => {
        color.dropdown.removeActiveItems();
    },
    toggle: () => {
        color.section.style.display = "block"
    },
    hashString: (str) => {
        const FNV_PRIME = 16777619;
        const OFFSET_BASIS = 2166136261;
        let hash = OFFSET_BASIS;

        if (!str) {
            console.log("hashString: Invalid string");
            return;
        }
        for (let i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i);
            hash *= FNV_PRIME;
        }

        return hash >>> 0;
    },
    getContrast: (hexColor, type = "hex") => {
        hexColor = hexColor?.replace("#", "");

        if (!type || type !== "hex" && type !== "image") {
            console.log("getContrast[type]: Invalid type");
            return;
        }
        if (!hexColor || !/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexColor)) {
            console.log("getContrast[hexColor]: Invalid hexColor");
            return;
        }
        
        const [r, g, b] = hexColor.match(/.{2}/g).map(color => parseInt(color, 16));
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        return type === "hex" ? (luminance >= 0.5 ? "#000000" : "#ffffff") : (luminance >= 0.5 ? color.blackSvgUrl : color.whiteSvgUrl);

    }
}
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/