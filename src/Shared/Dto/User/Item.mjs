/**
 * An item for users list.
 */
// MODULE'S VARS
const NS = 'Demo_Shared_Dto_User_Item';

// MODULE'S CLASSES
/**
 * @memberOf Demo_Shared_Dto_User_Item
 */
class Dto {
    static namespace = NS;
    /**
     * Masked email: a**g@gmail.com
     * @type {string}
     */
    email;
    /**
     * @type {Date}
     */
    dateRegistered;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Demo_Shared_Dto_User_Item {
    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        /**
         * @param {Demo_Shared_Dto_User_Item.Dto} [data]
         * @return {Demo_Shared_Dto_User_Item.Dto}
         */
        this.createDto = function (data) {
            // create new DTO
            const res = new Dto();
            // cast known attributes
            res.email = castString(data?.email);
            res.dateRegistered = castDate(data?.dateRegistered);
            return res;
        };
    }
}
