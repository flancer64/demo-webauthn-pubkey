/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class Demo_Shared_Defaults {
    // should be the same as `name` property in `./package.json`
    NAME = '@flancer64/demo-webauthn-pubkey';

    CFG_WEB_LOGS_AGG = 'logsAggregator';

    constructor() {
        Object.freeze(this);
    }
}
