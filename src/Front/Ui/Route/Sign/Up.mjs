/**
 * Route for new user registration.
 *
 * @namespace Demo_Front_Ui_Route_Sign_Up
 */
// MODULE'S VARS
const NS = 'Demo_Front_Ui_Route_Sign_Up';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Demo_Front_Ui_Route_Sign_Up.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Demo_Front_Defaults} */
    const DEF = spec['Demo_Front_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {TeqFw_Ui_Quasar_Front_Lib_Spinner.vueCompTmpl} */
    const uiSpinner = spec['TeqFw_Ui_Quasar_Front_Lib_Spinner$'];
    /** @type {Demo_Front_Mod_User} */
    const modUser = spec['Demo_Front_Mod_User$'];
    /** @type {Fl32_Auth_Front_Mod_PubKey} */
    const modPubKey = spec['Fl32_Auth_Front_Mod_PubKey$'];

    // VARS
    logger.setNamespace(NS);
    const template = `
<layout>
    <q-card>
        <ui-spinner :loading="ifLoading"/>
        <q-card-section>
            <div class="text-center">Sign Up</div>
            <q-form class="column q-gutter-sm">
                <q-input v-model="fldEmail"
                         autocomplete="email"
                         label="Your email"
                         outlined
                         type="email"
                />
                <q-toggle v-model="fldUsePubKey"
                          label="Use device authentication (fingerprint, etc.)"
                          v-if="ifPubKeyAvailable"
                />
                <q-input v-model="fldPassword"
                         :type="typePass"
                         autocomplete="new-password"
                         label="Your password"
                         outlined
                         v-if="!fldUsePubKey"
                >
                    <template v-slot:append>
                        <q-icon :name="iconPass"
                                @click="ifPassHidden = !ifPassHidden"
                                class="cursor-pointer"
                        />
                    </template>
                </q-input>
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
     * @memberOf Demo_Front_Ui_Route_Sign_Up
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
                const redirect = () => {
                    const query = this.$route?.query;
                    const to = query[DEF.PARAM_ROUTE_REDIRECT] ?? DEF.ROUTE_HOME;
                    this.$router.push(to);
                };

                // MAIN
                this.ifLoading = true;
                // request the back for attestation challenge
                const res = await modUser.register(this.fldEmail, this.fldPassword);
                this.ifLoading = false;
                if (res?.uuid) {
                    this.message = 'New user is registered.';
                    if (this.fldUsePubKey)
                        if (res?.challenge) {
                            // attest current device and register publicKey on the back
                            const userId = new Uint8Array(length);
                            window.crypto.getRandomValues(userId);
                            const publicKey = modPubKey.composeOptPkCreate({
                                challenge: res.challenge,
                                rpName: DEF.RP_NAME,
                                userId,
                                userName: `${this.fldEmail}`,
                                userUuid: res.uuid,
                            });
                            // noinspection JSValidateTypes
                            /** @type {PublicKeyCredential} */
                            const attestation = await navigator.credentials.create({publicKey});
                            this.ifLoading = true;
                            /** @type {Fl32_Auth_Shared_Web_Api_Attest.Response} */
                            const resAttest = await modPubKey.attest({attestation});
                            this.ifLoading = false;
                            if (resAttest?.attestationId) {
                                this.message = 'This device is attested for this user.';
                                setTimeout(redirect, DEF.TIMEOUT_REDIRECT);
                            } else {
                                this.message = 'This device is not attested for this user. Some error is occurred.';
                            }
                        } else {
                            this.message = 'Cannot receive attestation challenge from the back.';
                        }
                    else {
                        // password authentication succeed, redirect to home
                        setTimeout(redirect, DEF.TIMEOUT_REDIRECT);
                    }
                } else {
                    this.message = 'New user is not registered.';
                }
            }
        },
        mounted() {
            document.title = 'PK Authn: Sign Up';
            // use public key authentication if available
            modPubKey.isPublicKeyAvailable()
                .then((available) => {
                    this.ifPubKeyAvailable = available;
                    this.fldUsePubKey = available;
                });
        },
    };
}