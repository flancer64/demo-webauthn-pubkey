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
    /** @type {TeqFw_Core_Shared_Util_Format.date|function} */
    const date = spec['TeqFw_Core_Shared_Util_Format.date'];
    /** @type {Demo_Front_Mod_User} */
    const modUser = spec['Demo_Front_Mod_User$'];
    /** @type {Fl32_Auth_Front_Mod_Session} */
    const modSess = spec['Fl32_Auth_Front_Mod_Session$'];

    // VARS
    logger.setNamespace(NS);
    const template = `
<layout>
    <div class="column q-gutter-xs">
        <div class="text-center">This is restricted area. For authenticated users only.</div>
        <h6 class="text-center">Hi, {{userName}}</h6>
        <div>The 5 users who have registered most recently:</div>
        <ul>
            <li v-for="one of items">{{formatDate(one.dateRegistered)}}: {{one.email}}</li>
        </ul>
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
        data() {
            return {
                items: [],
                userName: null,
            };
        },
        methods: {
            formatDate: (val) => date(val),
        },
        async mounted() {
            document.title = 'PK Authn: Home';
            // noinspection JSValidateTypes
            /** @type {Demo_Shared_Dto_Session.Dto} */
            const session = modSess.getData();
            this.userName = session.email;
            this.items = await modUser.list();
        },
    };
}
