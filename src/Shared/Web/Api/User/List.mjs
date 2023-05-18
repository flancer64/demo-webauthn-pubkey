/**
 * This service lists the five users who have registered most recently.
 */
// MODULE'S VARS
const NS = 'Demo_Shared_Web_Api_User_List';

// MODULE'S CLASSES
/**
 * @memberOf Demo_Shared_Web_Api_User_List
 */
class Request {
    static namespace = NS;
}

/**
 * @memberOf Demo_Shared_Web_Api_User_List
 */
class Response {
    static namespace = NS;
    /**
     * List items.
     * @type {Demo_Shared_Dto_User_Item.Dto[]}
     */
    items;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Demo_Shared_Web_Api_User_List {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castArrayOfObj|function} */
        const castArrayOfObj = spec['TeqFw_Core_Shared_Util_Cast.castArrayOfObj'];
        /** @type {Demo_Shared_Dto_User_Item} */
        const dtoItem = spec['Demo_Shared_Dto_User_Item$'];

        // INSTANCE METHODS

        /**
         * @param {Demo_Shared_Web_Api_User_List.Request} [data]
         * @return {Demo_Shared_Web_Api_User_List.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            return res;
        };

        /**
         * @param {Demo_Shared_Web_Api_User_List.Response} [data]
         * @returns {Demo_Shared_Web_Api_User_List.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.items = castArrayOfObj(data?.items, dtoItem.createDto);
            return res;
        };
    }

}
