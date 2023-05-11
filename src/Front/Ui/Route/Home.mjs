/**
 * Screen for application's homepage.
 *
 * @namespace Demo_Front_Ui_Route_Home
 */
// MODULE'S VARS
const NS = 'Demo_Front_Ui_Route_Home';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Demo_Front_Ui_Route_Home.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Demo_Front_Defaults} */
    const DEF = spec['Demo_Front_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance

    // VARS
    logger.setNamespace(NS);
    const template = `
<layout>
    <div class="column q-gutter-xs">
        <h6 class="text-center">Demo App Homepage</h6>
        <div class="text-center">This is restricted area. For authenticated users only.</div>
    </div>
</layout>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Demo_Front_Ui_Route_Home
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {};
        },
        methods: {},
    };
}
