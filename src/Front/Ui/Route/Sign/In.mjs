/**
 * Route for user authentication.
 *
 * @namespace Demo_Front_Ui_Route_Sign_In
 */
// MODULE'S VARS
const NS = 'Demo_Front_Ui_Route_Sign_In';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Demo_Front_Ui_Route_Sign_In.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Demo_Front_Defaults} */
    const DEF = spec['Demo_Front_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {TeqFw_Ui_Quasar_Front_Lib_Spinner.vueCompTmpl} */
    const uiSpinner = spec['TeqFw_Ui_Quasar_Front_Lib_Spinner$'];
    /** @type {Fl32_Auth_Front_Mod_PubKey} */
    const modPubKey = spec['Fl32_Auth_Front_Mod_PubKey$'];
    /** @type {Fl32_Auth_Front_Mod_Password} */
    const modPass = spec['Fl32_Auth_Front_Mod_Password$'];

    // VARS
    logger.setNamespace(NS);
    const template = `
<layout>
    <q-card>
        <ui-spinner :loading="ifLoading"/>
        <q-card-section>
            <div class="text-center">Sign In</div>
            <q-form class="column q-gutter-sm">
                <q-toggle v-model="fldUsePubKey"
                          label="Use device authentication (fingerprint, etc.)"
                          v-if="ifPubKeyAvailable"
                />
                <template v-if="!fldUsePubKey">
                    <q-input v-model="fldEmail"
                             autocomplete="username"
                             label="Your email"
                             outlined
                             type="email"
                    />
                    <q-input v-model="fldPassword"
                             :type="typePass"
                             autocomplete="current-password"
                             label="Your password"
                             outlined
                    >
                        <template v-slot:append>
                            <q-icon :name="iconPass"
                                    @click="ifPassHidden = !ifPassHidden"
                                    class="cursor-pointer"
                            />
                        </template>
                    </q-input>
                </template>
            </q-form>
        </q-card-section>
        <q-card-actions align="center">
            <q-btn label="OK"
                   v-on:click="onOk"
            />
        </q-card-actions>
        <q-card-section>
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
     * @memberOf Demo_Front_Ui_Route_Sign_In
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {uiSpinner},
        data() {
            return {
                fldEmail: null,
                fldPassword: null,
                fldUsePubKey: false,
                ifLoading: false,
                ifPassHidden: true,
                ifPubKeyAvailable: false,
                message: null,
            };
        },
        computed: {
            iconPass() {
                return this.ifPassHidden ? 'visibility_off' : 'visibility';
            },
            typePass() {
                return this.ifPassHidden ? 'password' : 'text';
            },
        },
        methods: {
            async onOk() {
                // FUNCS
                const authPubKey = async () => {
                    this.ifLoading = true;
                    const resCh = await modPubKey.assertChallenge();
                    if (resCh?.challenge) {
                        const publicKey = modPubKey.composeOptPkGet({
                            challenge: resCh.challenge,
                            attestationId: resCh.attestationId
                        });
                        // noinspection JSValidateTypes
                        /** @type {PublicKeyCredential} */
                        const assertion = await navigator.credentials.get({publicKey});
                        // noinspection JSCheckFunctionSignatures
                        const resV = await modPubKey.validate(assertion.response);
                        if (resV?.success) {
                            this.message = 'Authentication is succeed.';
                            setTimeout(redirect, DEF.TIMEOUT_REDIRECT);
                        } else {
                            this.message = 'Authentication is failed.';
                        }
                    } else {
                        this.message = 'Cannot get authentication challenge from the back.';
                    }
                    this.ifLoading = false;
                };

                const authPassword = async () => {
                    const email = this.fldEmail;
                    const pass = this.fldPassword;
                    const res = await modPass.passwordValidate(email, pass);
                    if (res?.success) {
                        this.message = 'Authentication is succeed.';
                        setTimeout(redirect, DEF.TIMEOUT_REDIRECT);
                    } else {
                        this.message = 'Authentication is failed.';
                    }
                };

                const redirect = async () => {
                    // redirect to initial route
                    const query = this.$route?.query;
                    const to = query[DEF.PARAM_ROUTE_REDIRECT] ?? DEF.ROUTE_HOME;
                    this.$router.push(to);
                };

                // MAIN
                if (this.fldUsePubKey) await authPubKey();
                else await authPassword();
            }
        },
        mounted() {
            document.title = 'PK Authn: Sign In';
            // use public key authentication if available
            modPubKey.isPublicKeyAvailable()
                .then((available) => {
                    logger.info(`Public key environment is available on sign in.`);
                    this.ifPubKeyAvailable = available;
                    this.fldUsePubKey = available;
                });
        },
    };
}