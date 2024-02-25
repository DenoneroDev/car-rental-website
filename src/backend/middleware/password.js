const argon2 = require('argon2');
const AdminBro = require('admin-bro');


/** @type {AdminBro.After<AdminBro.ActionResponse>} */
const after = async (response) => {
    if (response.record && response.record.errors && response.record.errors.encryptedPassword) {
        response.record.errors.password = response.record.errors.encryptedPassword;
    }
    return response;
};

/** @type {AdminBro.Before} */
const before = async (request) => {
    if (request.method === 'post') {
        const { password, ...otherParams } = request.payload;

        if (password) {
            const encryptedPassword = await argon2.hash(password);

            return {
                ...request,
                payload: {
                    ...otherParams,
                    encryptedPassword,
                },
            };
        }
    }
    return request;
};

module.exports = { after, before };
/*43 6F 64 65 64 20 63 6F 6D 70 6C 65 74 65 6C 79 20 62 79 20 44 65 6E 6F 6E 65 72 6F 44 65 76*/