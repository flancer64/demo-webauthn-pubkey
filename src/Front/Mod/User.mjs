/**
 * Model to handle events related to user registration and authentication.
 * @namespace Demo_Front_Mod_User
 */
export default class Demo_Front_Mod_User {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Web_Api_Front_Web_Connect} */
        const connApi = spec['TeqFw_Web_Api_Front_Web_Connect$'];
        /** @type {Demo_Shared_Web_Api_Sign_Up} */
        const apiSignUp = spec['Demo_Shared_Web_Api_Sign_Up$'];
        /** @type {Fl32_Auth_Front_Mod_PubKey} */
        const modPubKey = spec['Fl32_Auth_Front_Mod_PubKey$'];
        /** @type {Fl32_Auth_Front_Mod_Password} */
        const modPass = spec['Fl32_Auth_Front_Mod_Password$'];
        /** @type {Fl32_Auth_Front_Mod_Session} */
        const modSess = spec['Fl32_Auth_Front_Mod_Session$'];

        // MAIN
        logger.setNamespace(this.constructor.name);

        // FUNCS

        // INSTANCE METHODS
        /**
         * Register new user on backend and get data to attest new user on the current device.
         * @param {string} email
         * @param {string} [password] plain password, if missed PublicKey authentication will be requested
         * @returns {Promise<Demo_Shared_Web_Api_Sign_Up.Response>}
         */
        this.register = async function (email, password) {
            try {
                const req = apiSignUp.createReq();
                req.email = email;
                if (password) {
                    req.usePubKey = false;
                    req.passwordSalt = modPass.saltNew(16);
                    req.passwordHash = await modPass.hashCompose(password, req.passwordSalt);
                    logger.info(`New user with pwd auth. (salt: ${req.passwordSalt}; hash: ${req.passwordHash}).`);
                } else {
                    req.usePubKey = await modPubKey.isPublicKeyAvailable();
                }
                // noinspection JSValidateTypes
                /** @type {Demo_Shared_Web_Api_Sign_Up.Response} */
                const res = await connApi.send(req, apiSignUp);
                // initialize session store if response contains session data (password authentication)
                if (res?.sessionData) modSess.setData(res?.sessionData);
                return res;
            } catch (e) {
                // timeout or error
                logger.error(`Cannot register attestation for a new user on the backend. Error: ${e?.message}`);
            }
            return null;
        };
    }
}
