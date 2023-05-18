/**
 * Plugin initialization function.
 */
// MODULE'S VARS
const NS = 'Demo_Back_Plugin_Init';

export default function Factory(spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {TeqFw_Db_Back_RDb_IConnect} */
    const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
    /** @type {TeqFw_Core_Back_Config} */
    const config = spec['TeqFw_Core_Back_Config$'];
    /** @type {TeqFw_Db_Back_Api_RDb_Schema} */
    const dbSchema = spec['TeqFw_Db_Back_Api_RDb_Schema$'];
    /** @type {TeqFw_Db_Back_Dem_Load} */
    const demLoad = spec['TeqFw_Db_Back_Dem_Load$'];
    /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
    /** @type {Demo_Back_RDb_Schema_User} */
    const rdbUser = spec['Demo_Back_RDb_Schema_User$'];
    /** @type {Demo_Back_Cron_Clean} */
    const cronClean = spec['Demo_Back_Cron_Clean$'];

    // VARS
    logger.setNamespace(NS);

    // FUNCS
    async function init() {
        // FUNCS

        /**
         * Don't (re-)create DB structure if '/app/user' table exists.
         * @return {Promise<boolean>}
         */
        async function needDbStruct() {
            let res = true;
            try {
                const trx = await conn.startTransaction();
                try {
                    const where = null, bind = null, order = null, limit = 1;
                    await crud.readSet(trx, rdbUser, where, bind, order, limit);
                    await trx.commit();
                    res = false;
                } catch (e) {
                    await trx.rollback();
                    logger.error(e);
                }
            } catch (e) {
                logger.error(e);
            }
            return res;
        }

        /**
         * Load DEM and re-create DB structure.
         * @return {Promise<void>}
         */
        async function createDbStruct() {
            // load DEMs then drop/create all tables
            const path = config.getPathToRoot();
            const {dem, cfg} = await demLoad.exec({path});
            await dbSchema.setDem({dem});
            await dbSchema.setCfg({cfg});
            await dbSchema.dropAllTables({conn});
            await dbSchema.createAllTables({conn});
            logger.info('Database structure is recreated.');
        }

        // MAIN
        if (await needDbStruct()) await createDbStruct();
        cronClean.start().catch(logger.error);
    }

    // MAIN
    Object.defineProperty(init, 'namespace', {value: NS});
    return init;
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'namespace', {value: NS});
