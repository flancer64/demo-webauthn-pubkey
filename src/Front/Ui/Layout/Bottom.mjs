/**
 * Bottom bar with configuration options.
 *
 * @namespace Demo_Front_Ui_Layout_Bottom
 */
// MODULE'S VARS
const NS = 'Demo_Front_Ui_Layout_Bottom';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Demo_Front_Ui_Layout_Bottom.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Demo_Front_Defaults} */
    const DEF = spec['Demo_Front_Defaults$'];
    /** @type {TeqFw_Web_Front_Mod_Config} */
    const modCfg = spec['TeqFw_Web_Front_Mod_Config$'];
    /** @type {Fl32_Log_Front_Logger_Transport} */
    const logTransport = spec['Fl32_Log_Front_Logger_Transport$'];

    // VARS
    const template = `
<div class="row q-gutter-md justify-center" style="padding-top: 20px">
    <div class="text-center">
        <q-checkbox dense v-model="fldLog" label="Enable Remote Log"/>
        <div v-if="fldLog">
            Logs will be aggregated <a :href="urlServer" target="_blank">here</a> and will be publicly
            available. 
        </div>
        <div v-if="fldLog">You can clean aggregated logs at any time.</div>
    </div>
</div>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Demo_Front_Ui_Layout_Bottom
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        data() {
            return {
                fldLog: false,
                urlServer: null,
            };
        },
        watch: {
            fldLog(cur) {
                if (cur) {
                    logTransport.enableLogs(this.urlServer);
                } else {
                    logTransport.disableLogs();
                }
            },
        },
        created() {
            /** @type {TeqFw_Web_Shared_Dto_Config_Front.Dto} */
            const cfg = modCfg.get();
            const domain = cfg?.custom[DEF.SHARED.CFG_WEB_LOGS_AGG];
            this.urlServer = (domain.includes('://')) ? domain : `//${domain}`;
            this.fldLog = logTransport.isLogsMonitorOn();
        },
    };
}
