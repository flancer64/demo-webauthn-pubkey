/**
 * Clean up expired data.
 */
// MODULE'S VARS
const TIMEOUT_LOOP = 86400000; // launch clean up every day (24*3600*1000=86400000)

// MODULE'S CLASSES
export default class Demo_Back_Cron_Clean {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Core_Shared_Util_Date.subtractDays|function} */
        const subtractDays = spec['TeqFw_Core_Shared_Util_Date.subtractDays'];
        /** @type {TeqFw_Db_Back_Util.dateUtc|function} */
        const dateUtc = spec['TeqFw_Db_Back_Util.dateUtc'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
        /** @type {Fl32_Auth_Back_RDb_Schema_Assert_Challenge} */
        const rdbAssertChl = spec['Fl32_Auth_Back_RDb_Schema_Assert_Challenge$'];
        /** @type {Fl32_Auth_Back_RDb_Schema_Attest_Challenge} */
        const rdbAttestChl = spec['Fl32_Auth_Back_RDb_Schema_Attest_Challenge$'];
        /** @type {Fl32_Auth_Back_RDb_Schema_Session} */
        const rdbSess = spec['Fl32_Auth_Back_RDb_Schema_Session$'];

        // VARS
        logger.setNamespace(this.constructor.name);
        let _idTimeout;
        const A_ASSERT_CHL = rdbAssertChl.getAttributes();
        const A_ATTEST_CHL = rdbAttestChl.getAttributes();
        const A_SESS = rdbSess.getAttributes();

        // FUNCS

        async function iteration() {
            // FUNCS

            async function cleanAssertChallenges(trx) {
                const expireDate = subtractDays(1);
                const where = (builder) => {
                    builder.where(A_ASSERT_CHL.DATE_CREATED, '<', dateUtc(expireDate));
                };
                await crud.deleteSet(trx, rdbAssertChl, where);
            }

            async function cleanAttestChallenges(trx) {
                const expireDate = subtractDays(1);
                const where = (builder) => {
                    builder.where(A_ATTEST_CHL.DATE_CREATED, '<', dateUtc(expireDate));
                };
                await crud.deleteSet(trx, rdbAttestChl, where);
            }

            async function cleanSessions(trx) {
                const expireDate = subtractDays(1);
                const where = (builder) => {
                    builder.where(A_SESS.DATE_CREATED, '<', dateUtc(expireDate));
                };
                await crud.deleteSet(trx, rdbAssertChl, where);
            }

            // MAIN
            const trx = await conn.startTransaction();
            try {
                await cleanAssertChallenges(trx);
                await cleanAttestChallenges(trx);
                await cleanSessions(trx);
                await trx.commit();
                // setup next iteration
                _idTimeout = setTimeout(iteration, TIMEOUT_LOOP);
            } catch (e) {
                await trx.rollback();
                logger.error(`Cron iteration for data cleaner is failed, iterations are aborted. Error: ${e?.message}`);
            }
        }

        // INSTANCE METHODS

        /**
         * Start events generation.
         * @returns {Promise<void>}
         */
        this.start = async function () {
            iteration().catch(logger.error);
            logger.info(`The data clean up is started.`);
        };

        /**
         * Clear timeout and stop events generation.
         */
        this.stop = function () {
            if (_idTimeout) {
                clearTimeout(_idTimeout);
                logger.info(`The data clean up is stopped.`);
            }
        };
    }
}
