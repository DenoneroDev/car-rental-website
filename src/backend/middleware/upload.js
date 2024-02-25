const path = require('path');
const fs = require('fs-extra');
const AdminBro = require('admin-bro');
const translate = require('../utils/translate');
const preTranslated = require('../utils/preTranslated');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

/** @type {AdminBro.After<AdminBro.ActionResponse>} */
const after = async (response, request, context) => {
    if (request.method === 'post') {
        const { record, images } = context;

        try {
            const params = record.params;
            if (params) {
                const details = params.details.map(({ _id, ...rest }) => rest);
                const translations = await Promise.all([
                    translate(params.description, 'de', false, true),
                    translate(params.title, 'de'),
                    translate(params.keywords, 'de'),
                    translate(details, 'de'),
                    translate(params.description, 'cs', false, true),
                    translate(params.title, 'cs'),
                    translate(params.keywords, 'cs'),
                    translate(details, 'cs'),
                ]);
                const translated = {
                    de: {
                        description: translations[0],
                        title: translations[1],
                        keywords: translations[2],
                        details: translations[3],
                        color: preTranslated.switchedGet("de", params.color),
                        fuel: preTranslated.switchedGet("de", params.fuel),
                        transmission: preTranslated.switchedGet("de", params.transmission),
                    },
                    cs: {
                        description: translations[4],
                        title: translations[5],
                        keywords: translations[6],
                        details: translations[7],
                        color: preTranslated.switchedGet("cs", params.color),
                        fuel: preTranslated.switchedGet("cs", params.fuel),
                        transmission: preTranslated.switchedGet("cs", params.transmission),
                    },
                };
                const update = {
                    ...translated, uuid: uuidv4().substr(0, 4),
                }
                if (images.length !== 0)
                    update.images = images.map((image) => image.path);
                await record.update(update);
            } else {
                throw new Error('Params object is null or undefined.');
            }
        } catch (error) {
            // Handle the error
            console.error('Error:', error.message);
        }
    }
    return response;
};

/** @type {AdminBro.Before} */
const before = async (request, context) => {
    try {
        if (request.method === 'post') {
            const parameters = request.payload;
            const { ...otherParams } = parameters;
            const images = (parameters.images) ? JSON.parse(parameters.images) : [];
            const keywords = Object.entries(parameters)
                .filter(([key]) => key.startsWith('keywords.'))
                .map(([_, value]) => value);
            context.images = images;
            context.keywords = keywords;

            return {
                ...request,
                payload: otherParams,
            };
        }
        return request;
    } catch (error) {
        console.error(error);
    }
};

module.exports = { after, before };
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/