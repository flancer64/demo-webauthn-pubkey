/**
 * Plugin finalization function.
 */
// MODULE'S VARS
const NS = 'Demo_Back_Plugin_Stop';

export default function Factory(spec) {
    // EXTRACT DEPS
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {Demo_Back_Cron_Clean} */
    const cronClean = spec['Demo_Back_Cron_Clean$'];

    // VARS
    logger.setNamespace(NS);

    // FUNCS
    async function exec() {
        cronClean.stop();
    }

    // MAIN
    Object.defineProperty(exec, 'namespace', {value: NS});
    return exec;
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'namespace', {value: NS});
