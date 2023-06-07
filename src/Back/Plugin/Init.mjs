/**
 * Plugin initialization function.
 */
// MODULE'S VARS
const NS = 'Demo_Back_Plugin_Init';

export default function Factory(spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {TeqFw_Db_Back_Process_CreateStruct} */
    const procCreateDb = spec['TeqFw_Db_Back_Process_CreateStruct$'];
    /** @type {Demo_Back_RDb_Schema_User} */
    const rdbUser = spec['Demo_Back_RDb_Schema_User$'];
    /** @type {Demo_Back_Cron_Clean} */
    const cronClean = spec['Demo_Back_Cron_Clean$'];

    // VARS
    logger.setNamespace(NS);

    // FUNCS
    async function init() {
        await procCreateDb.run({meta: rdbUser});
        cronClean.start().catch(logger.error);
    }

    // MAIN
    Object.defineProperty(init, 'namespace', {value: NS});
    return init;
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'namespace', {value: NS});
