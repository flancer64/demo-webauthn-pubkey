/**
 * Register new user in RDb and generate attest challenge (if requested).
 */
// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Demo_Back_Web_Api_Sign_Up {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Core_Shared_Util_Codec.hexToBin|function} */
        const hexToBin = spec['TeqFw_Core_Shared_Util_Codec.hexToBin'];
        /** @type {Demo_Shared_Web_Api_Sign_Up} */
        const endpoint = spec['Demo_Shared_Web_Api_Sign_Up$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
        /** @type {Demo_Back_RDb_Schema_User} */
        const rdbUser = spec['Demo_Back_RDb_Schema_User$'];
        /** @type {Fl32_Auth_Back_Mod_Session} */
        const modSess = spec['Fl32_Auth_Back_Mod_Session$'];
        /** @type {Fl32_Auth_Back_Mod_Password} */
        const modPass = spec['Fl32_Auth_Back_Mod_Password$'];
        /** @type {Fl32_Auth_Back_Mod_PubKey} */
        const modPubKey = spec['Fl32_Auth_Back_Mod_PubKey$'];

        // VARS
        logger.setNamespace(this.constructor.name);
        const A_USER = rdbUser.getAttributes();

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Demo_Shared_Web_Api_Sign_Up.Request} req
         * @param {Demo_Shared_Web_Api_Sign_Up.Response} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            // FUNCS

            /**
             * Create new user record in RDb.
             * @param {TeqFw_Db_Back_RDb_ITrans} trx
             * @param {string} email
             * @returns {Promise<*>}
             */
            async function addUser(trx, email) {
                const dto = rdbUser.createDto();
                dto.email = email;
                const {[A_USER.BID]: bid} = await crud.create(trx, rdbUser, dto);
                return bid;
            }

            // MAIN
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const email = req.email.trim().toLowerCase();
                const hash = hexToBin(req.passwordHash);
                const salt = hexToBin(req.passwordSalt);
                const usePubKey = req.usePubKey;
                // register user to RDb
                const userBid = await addUser(trx, email);
                if (usePubKey) {
                    // generate attestation challenge for newly registered user
                    const {challenge} = await modPubKey.attestChallengeCreate({trx, userBid});
                    res.challenge = challenge;
                } else {
                    // there is no public key authenticator in a browser, just save password hash & salt
                    await modPass.create({trx, userBid, hash, salt});
                    // establish new session
                    const {sessionData} = await modSess.establish({
                        trx,
                        userBid,
                        request: context.request,
                        response: context.response
                    });
                    if (sessionData) {
                        res.sessionData = sessionData;
                    }
                }
                await trx.commit();
                // this is simple sample, so we use email as name & uuid
                res.name = email;
                res.uuid = email;
                logger.info(JSON.stringify(res));
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }

}
