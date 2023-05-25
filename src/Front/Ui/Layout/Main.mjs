/**
 * Main layout component.
 *
 * @namespace Demo_Front_Ui_Layout_Main
 */
// MODULE'S VARS
const NS = 'Demo_Front_Ui_Layout_Main';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Demo_Front_Ui_Layout_Main.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Demo_Front_Defaults} */
    const DEF = spec['Demo_Front_Defaults$'];
    /** @type {Demo_Front_Ui_Layout_Bottom.vueCompTmpl} */
    const uiBottom = spec['Demo_Front_Ui_Layout_Bottom$'];
    /** @type {Demo_Front_Ui_Layout_Navigator.vueCompTmpl} */
    const uiNavigator = spec['Demo_Front_Ui_Layout_Navigator$'];

    // VARS
    const template = `
<div class="column q-gutter-xs">
    <ui-navigator/>
    <slot/>
    <ui-bottom/>
</div>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Demo_Front_Ui_Layout_Main
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {uiBottom, uiNavigator},
    };
}
