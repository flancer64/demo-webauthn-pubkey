/**
 * Navigation component.
 *
 * @namespace Demo_Front_Ui_Layout_Navigator
 */
// MODULE'S VARS
const NS = 'Demo_Front_Ui_Layout_Navigator';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Demo_Front_Ui_Layout_Navigator.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Demo_Front_Defaults} */
    const DEF = spec['Demo_Front_Defaults$'];
    /** @type {Fl32_Auth_Front_Mod_Session} */
    const modSess = spec['Fl32_Auth_Front_Mod_Session$'];

    // VARS
    const template = `
<div class="row q-gutter-md justify-around" style="padding-top: 10px">
    <router-link to="${DEF.ROUTE_HOME}" v-if="ifAuth">Home</router-link>
    <router-link to="${DEF.ROUTE_USER_SIGN_UP}" v-if="!ifAuth">Sign Up</router-link>
    <router-link to="${DEF.ROUTE_USER_SIGN_IN}" v-if="!ifAuth">Sign In</router-link>
    <router-link to="${DEF.ROUTE_USER_SIGN_OUT}" v-if="ifAuth">Sign Out</router-link>
</div>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Demo_Front_Ui_Layout_Navigator
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        data() {
            return {
                ifAuth: false,
            };
        },
        mounted() {
            this.ifAuth = modSess.isValid();
        },
    };
}
