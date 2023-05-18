/**
 * This service lists the five users who have registered most recently.
 */
// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Demo_Back_Web_Api_User_List {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Demo_Shared_Web_Api_User_List} */
        const endpoint = spec['Demo_Shared_Web_Api_User_List$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
        /** @type {Demo_Back_RDb_Schema_User} */
        const rdbUser = spec['Demo_Back_RDb_Schema_User$'];
        /** @type {Fl32_Auth_Back_Mod_Session} */
        const modSess = spec['Fl32_Auth_Back_Mod_Session$'];
        /** @type {Demo_Shared_Dto_User_Item} */
        const dtoItem = spec['Demo_Shared_Dto_User_Item$'];

        // VARS
        logger.setNamespace(this.constructor.name);
        const A_USER = rdbUser.getAttributes();

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Demo_Shared_Web_Api_User_List.Request} req
         * @param {Demo_Shared_Web_Api_User_List.Response} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            // FUNCS
            function maskEmail(email) {
                if (typeof email !== 'string') return '';
                const [username, domain] = email.split('@');
                const masked = username[0] + '...' + username[username.length - 1];
                return (domain) ? `${masked}@${domain}` : masked;
            }

            // MAIN
            /** @type {Demo_Shared_Dto_Session.Dto} */
            const sessData = modSess.getCachedData({request: context.request});
            if (sessData?.userId) {
                const trx = await conn.startTransaction();
                try {
                    // get the 5 last records from RDb
                    const where = null, bind = null;
                    const order = [{column: `${A_USER.DATE_CREATED}`, order: 'desc'}];
                    const limit = 5;
                    /** @type {Demo_Back_RDb_Schema_User.Dto[]} */
                    const found = await crud.readSet(trx, rdbUser, where, bind, order, limit);
                    await trx.commit();
                    // convert RDb data to shared DTO
                    res.items = [];
                    for (const one of found) {
                        const item = dtoItem.createDto();
                        item.email = maskEmail(one.email);
                        item.dateRegistered = one.date_created;
                        res.items.push(item);
                    }
                } catch (error) {
                    logger.error(error);
                    await trx.rollback();
                }
            }
            logger.info(JSON.stringify(res));
        };
    }

}
