/**
 * Route to close user session.
 *
 * @namespace Demo_Front_Ui_Route_Sign_Out
 */
// MODULE'S VARS
const NS = 'Demo_Front_Ui_Route_Sign_Out';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Demo_Front_Ui_Route_Sign_Out.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Demo_Front_Defaults} */
    const DEF = spec['Demo_Front_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {TeqFw_Ui_Quasar_Front_Lib_Spinner.vueCompTmpl} */
    const uiSpinner = spec['TeqFw_Ui_Quasar_Front_Lib_Spinner$'];
    /** @type {Fl32_Auth_Front_Mod_Session} */
    const modSess = spec['Fl32_Auth_Front_Mod_Session$'];

    // VARS
    logger.setNamespace(NS);
    const template = `
<layout>
    <q-card>
        <ui-spinner :loading="ifLoading"/>
        <q-card-section>
            <div class="text-center">Sign Out</div>
            <div class="text-center">{{message}}</div>
        </q-card-section>
    </q-card>
</layout>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Demo_Front_Ui_Route_Sign_Out
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {uiSpinner},
        data() {
            return {
                ifLoading: false,
                message: null,
            };
        },
        async mounted() {
            document.title = 'PK Authn: Sign Out';
            this.ifLoading = true;
            this.message = 'Closing the current session.';
            const res = await modSess.close();
            if (res.success) {
                this.message = 'The session is closed.';
                setTimeout(() => {
                    this.$router.push(DEF.ROUTE_USER_SIGN_IN);
                }, DEF.TIMEOUT_REDIRECT);
            } else {
                this.message = 'Some error is occurred.';
            }
            this.ifLoading = false;
        },
    };
}