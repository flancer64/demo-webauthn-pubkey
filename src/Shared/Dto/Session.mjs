/**
 * Session data for this app.
 */
// MODULE'S VARS
const NS = 'Demo_Shared_Dto_Session';

// MODULE'S CLASSES
/**
 * @memberOf Demo_Shared_Dto_Session
 */
class Dto {
    static namespace = NS;
    /** @type {string} */
    email;
    /**
     * Backend ID for the user.
     * @type {number}
     */
    userId;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Demo_Shared_Dto_Session {
    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        /**
         * @param {Demo_Shared_Dto_Session.Dto} [data]
         * @return {Demo_Shared_Dto_Session.Dto}
         */
        this.createDto = function (data) {
            // create new DTO
            const res = new Dto();
            // cast known attributes
            res.email = castString(data?.email);
            res.userId = castInt(data?.userId);
            return res;
        };
    }
}
