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
    /** @type {Fl32_Auth_Front_Mod_Store_Attestation.Store} */
    const modStore = spec['Fl32_Auth_Front_Mod_Store_Attestation.Store$'];
    /** @type {Fl32_Auth_Front_Mod_PubKey} */
    const modWebAuthn = spec['Fl32_Auth_Front_Mod_PubKey$'];
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
                    // define authentication mode: password or publicKey
                    /** @type {Fl32_Auth_Front_Mod_Store_Attestation.Dto} */
                    const dto = modStore.read();
                    const resCh = await modAuthKey.assertChallenge(dto.attestationId);
                    if (resCh?.challenge) {
                        const publicKey = modAuthKey.composeOptPkGet({
                            challenge: resCh.challenge,
                            attestationId: resCh.attestationId
                        });
                        const credGet = await navigator.credentials.get({publicKey});
                        const resV = await modSignIn.validatePubKey(credGet.response);
                        if (resV?.success) {
                            this.message = this.$t('route.user.sign.in.msg.success');
                            modSess.setData(resV.user);
                        } else {
                            this.message = this.$t('route.user.sign.in.msg.fail');
                        }
                    } else {
                        this.message = this.$t('route.user.sign.in.msg.failChallenge');
                    }
                    this.ifLoading = false;
                };

                const authPassword = async () => {
                    const email = this.fldEmail;
                    const pass = this.fldPassword;
                    const res = await modPass.passwordValidate(email, pass);
                    if (res?.success) {
                        this.message = 'Authentication is succeed.';
                        setTimeout(redirect, 2000);
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
            // use public key authentication if available
            modWebAuthn.isPublicKeyAvailable()
                .then((available) => {
                    this.ifPubKeyAvailable = available;
                    this.fldUsePubKey = available;
                });
        },
    };
}