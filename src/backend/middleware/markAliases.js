const path = require('path');
const fs = require('fs/promises');
const AdminBro = require('admin-bro');
const Car = require('../models/car');
const Mark = require('../models/mark');

/** @type {AdminBro.After<AdminBro.ActionResponse>} */
const after = async (response, request, context) => {
    const { record, aliases } = context;
    try {
        if (record.isValid()) {
            await Car.updateMany({ mark: Mark}, {mark: record.params.name, markAliases: aliases || []});
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
            const aliases = Object.entries(parameters)
                .filter(([key]) => key.startsWith('aliases.'))
                .map(([_, value]) => value);
            context.aliases = aliases;

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