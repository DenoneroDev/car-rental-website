const path = require('path');
const AdminBro = require('admin-bro');
const translate = require('../utils/translate');

/** @type {AdminBro.After<AdminBro.ActionResponse>} */
const after = async (response, request, context) => {
    try {
        if (request.method === 'post') {
            const { record, data } = context;
            
            if (record.isValid()) {
                const translations = await Promise.all([
                    translate(data.description, 'de', false, true),
                    translate(data.features, 'de'),
                    translate(data.description, 'cs'),
                    translate(data.features, 'cs'),
                ]);
                const translated = {
                    de: {
                        description: translations[0],
                        features: translations[1],
                    },
                    cs: {
                        description: translations[2],
                        features: translations[3],
                    },
                };
                await record.update({ ...translated });
            }
        }
        
    } catch (error) {
        console.error(error);
    }
    return response;
};

/** @type {AdminBro.Before} */
const before = async (request, context) => {
    try {
        if (request.method === 'post') {
            const parameters = request.payload;
            const { ...otherParams } = parameters;
            const features = Object.entries(parameters)
                .filter(([key]) => key.startsWith('features.'))
                .map(([_, value]) => value);
            context.data = {
                title: parameters.title,
                description: parameters.description,
                features: features,
            };

            return {
                ...request,
                payload: otherParams,
            };
        }
    } catch (error) {
        console.error(error);
    }
    return request;
};

module.exports = { after, before };
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/