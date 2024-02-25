const stringSimilarity = require('string-similarity');
const preTranslated = {
    de: {
        weiß: "white",
        schwarz: "black",
        beige: "beige",
        rot: "red",
        blau: "blue",
        grau: "gray",
        silber: "silver",
        gelb: "yellow",
        grün: "green",
        braun: "brown",
        bronze: "bronze",
        gold: "gold",
        orange: "orange",
        violett: "purple",
        automatisch: "automatic",
        elektrisch: "electric",
        benzin: "gasoline",
        wasserstoff: "hydrogen",
        "hybrid-elektrisch/benzin": "hybrid-electric/gasoline",
        "hybrid-elektrisch/diesel": "hybrid-electric/diesel",
        manuell: "manually",
        "tür": "doors",
        "sitze": "seats",
        "plätze": "seats",
    },
    cs: {
        biela: "weiß",
        čierna: "black",
        bežová: "beige",
        červená: "red",
        modrá: "blue",
        sivá: "gray",
        strieborná: "silver",
        žltá: "yellow",
        zelená: "green",
        hnedá: "brown",
        bronzová: "bronze",
        zlatá: "gold",
        oranžová: "orange",
        fialová: "purple",
        automat: "automatic",
        elektrická: "electric",
        benzík: "gasoline",
        "hybrid-elektrická/benzík": "hybrid-electric/gasoline",
        "hybrid-elektrická/diesel": "hybrid-electric/diesel",
        manuál: "manually",
        "túra": "doors",
        "sítce": "seats",
        plynu:  "gas"
    }
};
function switchObject(object) {
  const switchedObj = {};
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      switchedObj[object[key]] = key;
    }
  }
  return switchedObj;
};

const preTranslatedSwitched = {
    de: switchObject(preTranslated.de),
    cs: switchObject(preTranslated.cs)
}
function get(language, text) {
    if (!preTranslated[language]) {
        return text;
    }
    const wordsInLanguage = Object.keys(preTranslated[language]);
    const wordsInText = text.split(/\s+/);
    const translatedWords = wordsInText.map((word) => {
        const matches = stringSimilarity.findBestMatch(word, wordsInLanguage);
        const bestMatch = matches.bestMatch.target;
        const similarity = matches.bestMatch.rating;
        if (similarity >= (language == "de" ? 0.5 : 0.5)) {
            const translatedWord = preTranslated[language][bestMatch];
            return translatedWord || word;
        } else {
            return word;
        }
    });
    const translatedText = translatedWords.join(' ');

    return translatedText;
}
function switchedGet(language, text) {
    if (!preTranslatedSwitched[language]) {
        return text;
    }
    const wordsInLanguage = Object.keys(preTranslatedSwitched[language]);
    const wordsInText = text.split(/\s+/);
    const originalWords = wordsInText.map((word) => {
        const matches = stringSimilarity.findBestMatch(word, wordsInLanguage);
        const bestMatch = matches.bestMatch.target;
        const similarity = matches.bestMatch.rating;
        if (similarity >= (language == "de" ? 0.5 : 0.5)) {
            const originalWord = preTranslatedSwitched[language][bestMatch];
            return originalWord || word;
        } else {
            return word;
        }
    });
    const originalText = originalWords.join(' ');

    return originalText;
}

module.exports = {
    get: get,
    switchedGet: switchedGet
};