/**
 * Register new user on backend and  continue with authentication model: save password hash
 * or get WebAuthn attestation challenge
 */
// MODULE'S VARS
const NS = 'Demo_Shared_Web_Api_Sign_Up';

// MODULE'S CLASSES
/**
 * @memberOf Demo_Shared_Web_Api_Sign_Up
 */
class Request {
    static namespace = NS;
    /** @type {string} */
    email;
    /**
     * Binary data as HEX string.
     * @type {string}
     */
    passwordHash;
    /**
     * Binary data as HEX string.
     * @type {string}
     */
    passwordSalt;
    /**
     * 'true' if the front end supports the WebAuthn API, and we should attest the user.
     * @type {boolean}
     */
    usePubKey;
}

/**
 * @memberOf Demo_Shared_Web_Api_Sign_Up
 */
class Response {
    static namespace = NS;
    /**
     * base64url encoded binary data (32 bytes) to attest the user.
     * @type {string}
     */
    challenge;
    /**
     * Use user email as user name.
     * @type {string}
     */
    name;
    /**
     * App-specific data for the newly established session.
     * @type {Object}
     */
    sessionData;
    /**
     * Use user email as UUID.
     * @type {string}
     */
    uuid;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Demo_Shared_Web_Api_Sign_Up {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
        const castBoolean = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS

        /**
         * @param {Demo_Shared_Web_Api_Sign_Up.Request} [data]
         * @return {Demo_Shared_Web_Api_Sign_Up.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.email = castString(data?.email);
            res.passwordHash = castString(data?.passwordHash);
            res.passwordSalt = castString(data?.passwordSalt);
            res.usePubKey = castBoolean(data?.usePubKey);
            return res;
        };

        /**
         * @param {Demo_Shared_Web_Api_Sign_Up.Response} [data]
         * @returns {Demo_Shared_Web_Api_Sign_Up.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.challenge = castString(data?.challenge);
            res.name = castString(data?.name);
            res.sessionData = structuredClone(data?.sessionData);
            res.uuid = castString(data?.uuid);
            return res;
        };
    }

}
