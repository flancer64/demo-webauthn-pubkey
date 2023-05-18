/**
 * Plugin constants (hardcoded configuration) for frontend code.
 */
export default class Demo_Front_Defaults {
    PARAM_ROUTE_REDIRECT = 'redirect';

    ROUTE_HOME = '/';
    ROUTE_USER_SIGN_IN = '/user/sign/in';
    ROUTE_USER_SIGN_OUT = '/user/sign/out';
    ROUTE_USER_SIGN_UP = '/user/sign/up';

    RP_NAME = 'WebAuthn Demo';
    /** @type {Demo_Shared_Defaults} */
    SHARED;

    TIMEOUT_REDIRECT = 1000;

    constructor(spec) {
        this.SHARED = spec['Demo_Shared_Defaults$'];
        Object.freeze(this);
    }
}
