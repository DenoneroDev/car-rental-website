const translate = require('translate-google');
const { JSDOM } = require('jsdom');

async function translateTo(data, to, autoDetect = false, isHTML = false) {
    let text = data;
    if (!data || (Array.isArray(data) && data.length === 0)) {
        return data;
    }
    if (Array.isArray(data)) {
        return await translate(text, { from: (autoDetect) ? "auto" : "en", to: to });
    }
    text = text.replace(/\.([^ ])/g, '. $1');
    if (isHTML) {
        const dom = new JSDOM(text);
        const document = dom.window.document;

        const replaceText = async (node) => {
        if (node.nodeType === document.TEXT_NODE) {
                const translation = await translate(node.textContent, {
                  from: (autoDetect) ? "auto" : "en",
                  to: to,
                });
                node.textContent = translation.replace(/\.([^ ])/g, '. $1');
            } else {
                for (const childNode of node.childNodes) {
                  await replaceText(childNode);
                }
            }
        };
        await replaceText(document.body);
        return document.body.innerHTML;
    }
    const translation = await translate(text, { from: (autoDetect) ? "auto" : "en", to: to });
    return translation.replace(/\.([^ ])/g, '. $1');
}
module.exports = translateTo;