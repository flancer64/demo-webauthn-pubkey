/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class Demo_Back_Defaults {

    /** @type {Demo_Shared_Defaults} */
    SHARED;

    constructor(spec) {
        this.SHARED = spec['Demo_Shared_Defaults$'];
        Object.freeze(this);
    }
}
